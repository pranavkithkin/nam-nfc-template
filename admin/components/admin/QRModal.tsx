"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface Props {
  slug: string;
  name: string;
  baseUrl: string;
  onClose: () => void;
}

export default function QRModal({ slug, name, baseUrl, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState("");
  const url = `${baseUrl}/c/${slug}`;

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, {
      width: 320,
      margin: 2,
      color: { dark: "#0a1628", light: "#ffffff" },
      errorCorrectionLevel: "H",
    });
    QRCode.toDataURL(url, {
      width: 512,
      margin: 2,
      color: { dark: "#0a1628", light: "#ffffff" },
      errorCorrectionLevel: "H",
    }).then(setDataUrl);
  }, [url]);

  function download() {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${slug}-qr.png`;
    a.click();
  }

  function copyUrl() {
    navigator.clipboard.writeText(url);
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0d1627] border border-white/10 rounded-2xl w-full max-w-sm p-6 flex flex-col items-center gap-5 animate-fade-in-up shadow-card">
        {/* Header */}
        <div className="w-full flex items-start justify-between">
          <div>
            <h2 className="font-heading font-bold text-white text-lg">{name}</h2>
            <p className="text-xs font-mono text-white/35 mt-0.5 break-all">{url}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white transition-colors p-1 ml-2 shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* QR Code */}
        <div className="p-4 bg-white rounded-2xl shadow-inner">
          <canvas ref={canvasRef} className="block rounded-lg" />
        </div>

        {/* Powered by label below QR */}
        <p className="text-xs text-white/30 -mt-3">
          Scan to open · Powered by <span className="text-gold font-semibold">NAM</span>
        </p>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <button
            onClick={download}
            className="flex-1 flex items-center justify-center gap-2 bg-gold-gradient text-navy font-heading font-bold text-sm py-3 rounded-xl hover:shadow-gold transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download QR
          </button>
          <button
            onClick={copyUrl}
            className="flex items-center justify-center gap-2 border border-white/15 text-white/60 hover:text-white hover:border-white/30 px-4 py-3 rounded-xl text-sm transition-all"
            title="Copy URL"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" />
            </svg>
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
