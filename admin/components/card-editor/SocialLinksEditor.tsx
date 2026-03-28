"use client";

import { useState, useRef } from "react";

const PLATFORMS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "twitter", label: "X / Twitter" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "snapchat", label: "Snapchat" },
  { value: "telegram", label: "Telegram" },
  { value: "behance", label: "Behance" },
  { value: "github", label: "GitHub" },
  { value: "dribbble", label: "Dribbble" },
  { value: "pinterest", label: "Pinterest" },
  { value: "spotify", label: "Spotify" },
  { value: "website", label: "Website" },
];

interface SLink { platform: string; url: string; label: string; order: number }

interface Props {
  links: SLink[];
  onChange: (links: SLink[]) => void;
}

export default function SocialLinksEditor({ links, onChange }: Props) {
  const [dragging, setDragging] = useState<number | null>(null);
  const dragOverRef = useRef<number | null>(null);

  function addLink() {
    onChange([
      ...links,
      { platform: "linkedin", url: "", label: "LinkedIn", order: links.length },
    ]);
  }

  function removeLink(i: number) {
    const next = links.filter((_, idx) => idx !== i).map((l, idx) => ({ ...l, order: idx }));
    onChange(next);
  }

  function updateLink(i: number, field: keyof SLink, value: string) {
    const next = links.map((l, idx) => {
      if (idx !== i) return l;
      const updated = { ...l, [field]: value };
      // Auto-fill label when platform changes
      if (field === "platform") {
        updated.label = PLATFORMS.find((p) => p.value === value)?.label || value;
      }
      return updated;
    });
    onChange(next);
  }

  function handleDragEnd() {
    if (dragging === null || dragOverRef.current === null) {
      setDragging(null);
      return;
    }
    const next = [...links];
    const [moved] = next.splice(dragging, 1);
    next.splice(dragOverRef.current, 0, moved);
    onChange(next.map((l, i) => ({ ...l, order: i })));
    setDragging(null);
    dragOverRef.current = null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-white/40 uppercase tracking-wider font-medium">
          {links.length} link{links.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={addLink}
          className="text-xs text-gold hover:text-gold-light border border-gold/25 hover:border-gold/50 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          Add Link
        </button>
      </div>

      <div className="space-y-2">
        {links.map((link, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => setDragging(i)}
            onDragOver={(e) => { e.preventDefault(); dragOverRef.current = i; }}
            onDragEnd={handleDragEnd}
            className={`nam-surface rounded-xl p-3 transition-all ${dragging === i ? "opacity-50" : ""}`}
          >
            <div className="flex items-center gap-2">
              {/* Drag handle */}
              <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/40 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <circle cx="9" cy="6" r="1.5" />
                  <circle cx="15" cy="6" r="1.5" />
                  <circle cx="9" cy="12" r="1.5" />
                  <circle cx="15" cy="12" r="1.5" />
                  <circle cx="9" cy="18" r="1.5" />
                  <circle cx="15" cy="18" r="1.5" />
                </svg>
              </div>

              {/* Platform */}
              <select
                value={link.platform}
                onChange={(e) => updateLink(i, "platform", e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-gold/40 min-w-[110px]"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>

              {/* URL */}
              <input
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                placeholder="https://…"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-gold/40 transition-all font-mono"
              />

              {/* Remove */}
              <button
                onClick={() => removeLink(i)}
                className="text-white/25 hover:text-red-400 transition-colors p-1"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Custom label */}
            <input
              value={link.label}
              onChange={(e) => updateLink(i, "label", e.target.value)}
              placeholder="Display label"
              className="mt-2 ml-6 bg-white/3 border border-white/8 rounded-lg px-3 py-1.5 text-xs text-white/60 placeholder-white/20 focus:outline-none focus:border-gold/30 transition-all w-48"
            />
          </div>
        ))}

        {links.length === 0 && (
          <button
            onClick={addLink}
            className="w-full border border-dashed border-white/15 rounded-xl py-8 text-sm text-white/30 hover:border-gold/30 hover:text-white/50 transition-all"
          >
            + Add your first social link
          </button>
        )}
      </div>
    </div>
  );
}
