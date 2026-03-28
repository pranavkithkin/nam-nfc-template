"use client";

import { useRef, useState } from "react";

interface Props {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUploader({ label, hint, value, onChange, folder }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Max 5MB.");
      return;
    }

    setUploading(true);
    setError("");

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUri: reader.result, folder }),
        });

        if (!res.ok) throw new Error("Upload failed");
        const { url } = await res.json();
        onChange(url);
      } catch {
        setError("Upload failed. Check Cloudinary credentials.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">{label}</p>
      {hint && <p className="text-xs text-white/30 mb-3">{hint}</p>}

      <div
        onClick={() => fileRef.current?.click()}
        className="relative group cursor-pointer rounded-xl border border-dashed border-white/15 hover:border-gold/40 transition-all overflow-hidden"
      >
        {value ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={label} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
              <span className="text-xs text-white font-medium">Change Image</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            {uploading ? (
              <>
                <div className="w-6 h-6 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
                <p className="text-xs text-white/40">Uploading…</p>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-white/20">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="text-xs text-white/35">Click to upload</p>
                <p className="text-xs text-white/20">JPG, PNG, WebP · Max 5MB</p>
              </>
            )}
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
          <button
            onClick={() => onChange("")}
            className="text-xs text-white/30 hover:text-red-400 transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
