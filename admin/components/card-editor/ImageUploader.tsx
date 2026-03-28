"use client";

import { useRef, useState, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface Props {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  aspect?: number; // e.g. 1 for square, 3 for banner
}

// Compress + crop to a canvas, return a base64 JPEG under targetKB
function cropToDataUri(
  image: HTMLImageElement,
  crop: PixelCrop,
  targetMaxKB = 800
): string {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  // Try reducing quality until under targetMaxKB
  let quality = 0.85;
  let dataUri = canvas.toDataURL("image/jpeg", quality);
  while (dataUri.length > targetMaxKB * 1024 * 1.37 && quality > 0.3) {
    quality -= 0.1;
    dataUri = canvas.toDataURL("image/jpeg", quality);
  }
  return dataUri;
}

export default function ImageUploader({ label, hint, value, onChange, folder, aspect }: Props) {
  const [srcImg, setSrcImg] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected
    e.target.value = "";
    setError("");

    const reader = new FileReader();
    reader.onload = () => {
      setSrcImg(reader.result as string);
      setShowModal(true);
      setCrop(undefined);
    };
    reader.readAsDataURL(file);
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const defaultAspect = aspect ?? 1;
    const centred = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, defaultAspect, width, height),
      width,
      height
    );
    setCrop(centred);
  }

  const handleUpload = useCallback(async () => {
    if (!imgRef.current || !completedCrop) return;
    setUploading(true);
    setError("");

    try {
      const dataUri = cropToDataUri(imgRef.current, completedCrop);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUri, folder }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Upload failed");
      }
      const { url } = await res.json();
      onChange(url);
      setShowModal(false);
      setSrcImg("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [completedCrop, folder, onChange]);

  return (
    <div>
      <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">{label}</p>
      {hint && <p className="text-xs text-white/30 mb-3">{hint}</p>}

      {/* Drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        className="relative group cursor-pointer rounded-xl border border-dashed border-white/15 hover:border-gold/40 transition-all overflow-hidden"
      >
        {value ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={label} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-white">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span className="text-xs text-white font-medium">Change / Crop</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-white/20">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-xs text-white/35">Click to upload</p>
            <p className="text-xs text-white/20">JPG, PNG, WebP · Any size</p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}

      {value && (
        <div className="flex items-center gap-2 mt-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste image URL…"
            className="flex-1 bg-white/4 border border-white/8 rounded-lg px-3 py-1.5 text-xs font-mono text-white/50 focus:outline-none focus:border-gold/30 transition-all"
          />
          <button onClick={() => onChange("")} className="text-xs text-white/30 hover:text-red-400 transition-colors">
            Remove
          </button>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      {/* ── Crop Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
          <div className="bg-[#0d1831] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col gap-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
              <div>
                <h3 className="text-sm font-bold text-white">Crop Image</h3>
                <p className="text-xs text-white/40 mt-0.5">Drag the handles to adjust · Image will be compressed automatically</p>
              </div>
              <button onClick={() => { setShowModal(false); setSrcImg(""); }} className="text-white/30 hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Crop area */}
            <div className="px-5 py-4 flex justify-center bg-black/20 max-h-[60vh] overflow-auto">
              <ReactCrop
                crop={crop}
                onChange={(_, pct) => setCrop(pct)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect ?? 1}
                circularCrop={false}
                keepSelection
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={srcImg}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  style={{ maxHeight: "50vh", maxWidth: "100%", objectFit: "contain" }}
                />
              </ReactCrop>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.07]">
              <button
                onClick={() => { setShowModal(false); setSrcImg(""); }}
                className="text-sm text-white/40 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !completedCrop}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #d4a853, #f5cf8a)", color: "#0a1628" }}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0a1628]/30 border-t-[#0a1628] rounded-full animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload &amp; Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
