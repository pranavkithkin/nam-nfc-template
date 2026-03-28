"use client";

// ═══════════════════════════════════════════════════════════════
// PublicCardPage — pixel-perfect NAM NFC template rendered from DB data
// Mirrors the existing index.html / style.css / main.js design exactly
// ═══════════════════════════════════════════════════════════════

import { useEffect } from "react";

const PLATFORM_ICONS: Record<string, string> = {
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
  behance: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.609.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.63.159-1.31.243-2.035.243H0v-15.15h6.938zm-.71 6.294c.58 0 1.06-.14 1.44-.435.38-.29.56-.75.56-1.36 0-.35-.07-.64-.18-.87-.12-.23-.29-.41-.5-.54-.21-.13-.46-.22-.74-.27-.27-.06-.57-.08-.88-.08H3.37v3.55h2.86zm.18 6.597c.33 0 .65-.03.96-.09.3-.06.57-.17.8-.33.23-.16.41-.37.55-.65.13-.27.2-.62.2-1.04 0-.81-.24-1.4-.71-1.74-.48-.34-1.1-.51-1.85-.51H3.37v4.36h3.04zm10.76 1.42c.48.37 1.13.56 1.93.56.57 0 1.06-.14 1.49-.42.43-.28.7-.58.82-.89h2.72c-.44 1.32-1.11 2.26-2.01 2.83-.9.57-1.99.85-3.27.85-.89 0-1.69-.14-2.42-.44-.73-.29-1.35-.71-1.86-1.25-.51-.54-.9-1.18-1.18-1.94-.28-.75-.42-1.58-.42-2.48 0-.87.14-1.68.43-2.42.29-.74.69-1.38 1.2-1.93.51-.54 1.12-.97 1.83-1.27.71-.31 1.49-.46 2.34-.46.94 0 1.76.18 2.46.56.7.37 1.27.88 1.73 1.52.45.65.78 1.39.99 2.24.21.85.28 1.75.22 2.68h-8.1c-.05.96.24 1.83.71 2.2zM19.5 11.5c-.4-.38-1-.57-1.76-.57-.51 0-.94.1-1.29.3-.34.19-.62.44-.82.74-.2.3-.34.63-.42.97-.08.35-.13.67-.14.97h5.13c-.07-.84-.3-1.81-.7-2.41zm-5.5-5.7h5.8v1.57h-5.8V5.8z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
  dribbble: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.81zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-2.09-1.86-4.845-2.99-7.84-2.99-.46 0-.915.03-1.36.1zm10.019 3.015c-.21.288-1.91 2.48-5.69 4.012.22.448.43.9.62 1.357.067.16.13.32.19.477 3.4-.427 6.777.258 7.11.33-.02-2.33-.88-4.48-2.23-6.18z"/></svg>`,
  spotify: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
};

const PLATFORM_COLORS: Record<string, string> = {
  linkedin: "linear-gradient(135deg, #0077B5, #00a0dc)",
  instagram: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
  twitter: "linear-gradient(135deg, #1a1a1a, #333)",
  whatsapp: "linear-gradient(135deg, #25D366, #128C7E)",
  facebook: "linear-gradient(135deg, #1877F2, #42a5f5)",
  youtube: "linear-gradient(135deg, #FF0000, #ff4444)",
  tiktok: "linear-gradient(135deg, #000000, #25F4EE)",
  snapchat: "linear-gradient(135deg, #FFFC00, #ffd600)",
  behance: "linear-gradient(135deg, #1769FF, #0050ff)",
  github: "linear-gradient(135deg, #333, #24292e)",
  telegram: "linear-gradient(135deg, #0088cc, #229ED9)",
  dribbble: "linear-gradient(135deg, #EA4C89, #c7254e)",
  pinterest: "linear-gradient(135deg, #E60023, #bd081c)",
  spotify: "linear-gradient(135deg, #1DB954, #1ed760)",
  website: "linear-gradient(135deg, #d4a853, #f5cf8a)",
};

interface SocialLink { platform: string; url: string; label?: string | null }
interface Company {
  name: string; industry?: string | null; description?: string | null;
  address?: string | null; website?: string | null; mapUrl?: string | null; logoUrl?: string | null;
}

interface Card {
  name: string; title?: string | null; bio?: string | null;
  phone?: string | null; email?: string | null; website?: string | null; location?: string | null;
  avatarUrl?: string | null; coverUrl?: string | null;
  colorPrimary: string; colorSecondary: string; colorAccent: string; colorAccentHover: string;
  socialLinks: SocialLink[];
  company?: Company | null;
}

interface Props { card: Card; isPreview: boolean }

function downloadVCard(card: Card) {
  const lines = [
    "BEGIN:VCARD", "VERSION:3.0",
    `FN:${card.name}`,
    card.title ? `TITLE:${card.title}` : "",
    card.company ? `ORG:${card.company.name}` : "",
    card.phone ? `TEL;TYPE=CELL:${card.phone}` : "",
    card.email ? `EMAIL:${card.email}` : "",
    card.website ? `URL:${card.website}` : "",
    card.location ? `ADR;TYPE=WORK:;;${card.location}` : "",
    card.bio ? `NOTE:${card.bio}` : "",
    "END:VCARD",
  ].filter(Boolean).join("\n");

  const blob = new Blob([lines], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${card.name.replace(/\s+/g, "_")}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}

async function shareCard() {
  if (navigator.share) {
    try { await navigator.share({ title: document.title, url: window.location.href }); return; } catch {}
  }
  await navigator.clipboard.writeText(window.location.href).catch(() => {});
  const t = document.createElement("div");
  t.innerText = "Link copied!";
  Object.assign(t.style, {
    position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)",
    background: "linear-gradient(135deg,#d4a853,#f5cf8a)", color: "#0a1628",
    padding: "10px 22px", borderRadius: "50px", fontSize: "13px", fontWeight: "700",
    zIndex: "9999", boxShadow: "0 4px 20px rgba(212,168,83,0.4)",
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

export default function PublicCardPage({ card, isPreview }: Props) {
  const accent = card.colorAccent;
  const accentGrad = `linear-gradient(135deg, ${accent}, ${card.colorAccentHover})`;
  const initials = card.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  // Apply CSS variables
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--primary", card.colorPrimary);
    r.style.setProperty("--secondary", card.colorSecondary);
    r.style.setProperty("--accent", card.colorAccent);
    r.style.setProperty("--accent-hover", card.colorAccentHover);
    r.style.setProperty("--accent-gradient", accentGrad);
    document.body.style.background = card.colorPrimary;
    return () => { document.body.style.background = ""; };
  }, [card, accentGrad]);

  return (
    <div
      style={{ background: card.colorPrimary, color: "#fff", minHeight: "100vh", fontFamily: "'Inter', sans-serif", lineHeight: "1.6" }}
    >
      {/* Preview Banner */}
      {isPreview && (
        <div className="sticky top-0 z-50 bg-amber-500/20 border-b border-amber-500/30 text-amber-300 text-xs text-center py-1.5 font-medium tracking-wide">
          ⚠ Preview Mode — this card is not yet published
        </div>
      )}

      {/* NAM Top Bar */}
      <header style={{
        position: "sticky", top: isPreview ? "30px" : 0, zIndex: 100,
        background: "rgba(10,22,40,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px 16px" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px", animation: "pulseNfc 2s ease-in-out infinite" }}>
            <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36"/><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58"/>
            <path d="M12.91 4.1a16.1 16.1 0 0 1 0 15.8"/><path d="M16.37 2a20.16 20.16 0 0 1 0 20"/>
          </svg>
          <span style={{ fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontFamily: "'Outfit',sans-serif" }}>
            Powered by <strong style={{ color: accent }}>NAM</strong>
          </span>
        </div>
      </header>

      {/* Hero */}
      <section style={{ position: "relative", textAlign: "center", paddingBottom: "32px" }}>
        {/* Cover */}
        <div style={{
          height: "200px",
          background: card.coverUrl ? `url(${card.coverUrl}) center/cover` : card.colorSecondary,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 30%, ${card.colorPrimary} 100%)` }} />
        </div>

        {/* Profile */}
        <div style={{ position: "relative", marginTop: "-70px", zIndex: 10, padding: "0 24px" }}>
          {/* Avatar ring */}
          <div style={{ display: "inline-block", padding: "4px", borderRadius: "50%", background: accentGrad, marginBottom: "16px", animation: "glowPulse 3s ease-in-out infinite" }}>
            {card.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.avatarUrl} alt={card.name} style={{ width: "130px", height: "130px", borderRadius: "50%", objectFit: "cover", border: `4px solid ${card.colorPrimary}`, display: "block" }} />
            ) : (
              <div style={{ width: "130px", height: "130px", borderRadius: "50%", background: card.colorSecondary, border: `4px solid ${card.colorPrimary}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", fontSize: "48px", fontWeight: "800", color: accent }}>
                {initials}
              </div>
            )}
          </div>

          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "28px", fontWeight: "800", letterSpacing: "-0.5px", margin: "0 0 6px", animation: "fadeInUp 0.6s ease-out 0.3s both" }}>
            {card.name}
          </h1>
          {card.title && <p style={{ fontSize: "16px", fontWeight: "500", color: accent, margin: "0 0 4px", animation: "fadeInUp 0.6s ease-out 0.4s both" }}>{card.title}</p>}
          {card.company && <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", margin: "0 0 4px", animation: "fadeInUp 0.6s ease-out 0.45s both" }}>{card.company.name}</p>}
          {card.bio && <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", maxWidth: "400px", margin: "12px auto 0", lineHeight: "1.6", animation: "fadeInUp 0.6s ease-out 0.5s both" }}>{card.bio}</p>}
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", padding: "0 20px", margin: "10px auto", maxWidth: "480px", animation: "fadeInUp 0.6s ease-out 0.55s both" }}>
        {[
          { label: "Save Contact", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`, action: "save" },
          { label: "Share", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`, action: "share" },
          card.phone ? { label: "Call", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`, action: "call" } : null,
          card.email ? { label: "Email", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`, action: "email" } : null,
        ].filter(Boolean).map((btn) => (
          btn && <button
            key={btn.action}
            onClick={() => {
              if (btn.action === "save") downloadVCard(card);
              else if (btn.action === "share") shareCard();
              else if (btn.action === "call" && card.phone) window.location.href = `tel:${card.phone.replace(/\s/g, "")}`;
              else if (btn.action === "email" && card.email) window.location.href = `mailto:${card.email}`;
            }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
              padding: "16px 8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px", color: "#fff", fontSize: "11px", fontWeight: "500", cursor: "pointer",
              transition: "all 0.3s", fontFamily: "'Inter',sans-serif",
            }}
          >
            <div style={{ width: "22px", height: "22px", color: accent }} dangerouslySetInnerHTML={{ __html: btn.icon }} />
            {btn.label}
          </button>
        ))}
      </section>

      {/* Social Links */}
      {card.socialLinks.length > 0 && (
        <section style={{ padding: "30px 0", maxWidth: "480px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px", padding: "0 24px", marginBottom: "18px" }}>
            <span style={{ color: accent }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "22px", height: "22px" }}>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </span>
            Connect With Me
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "0 20px" }}>
            {card.socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "16px", textDecoration: "none", color: "#fff",
                  transition: "all 0.3s",
                }}
              >
                <div
                  style={{
                    width: "40px", height: "40px", minWidth: "40px", borderRadius: "10px",
                    background: PLATFORM_COLORS[link.platform] || PLATFORM_COLORS.website,
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                  }}
                  dangerouslySetInnerHTML={{ __html: PLATFORM_ICONS[link.platform] || "" }}
                />
                <span style={{ flex: 1, fontWeight: "500", fontSize: "15px" }}>{link.label || link.platform}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }}>
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Company Details */}
      {card.company && (
        <section style={{ padding: "20px 0 40px", maxWidth: "480px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px", padding: "0 24px", marginBottom: "18px" }}>
            <span style={{ color: accent }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "22px", height: "22px" }}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </span>
            About The Company
          </h2>
          <div style={{ margin: "0 20px", padding: "24px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              {card.company.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={card.company.logoUrl} alt="" style={{ width: "56px", height: "56px", objectFit: "contain", borderRadius: "10px", background: "rgba(255,255,255,0.08)", padding: "8px" }} />
              )}
              <div>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "18px", fontWeight: "700", margin: "0 0 2px" }}>{card.company.name}</h3>
                {card.company.industry && <span style={{ fontSize: "13px", color: accent, fontWeight: "500" }}>{card.company.industry}</span>}
              </div>
            </div>
            {card.company.description && <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: "1.7", marginBottom: "20px" }}>{card.company.description}</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {card.company.address && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px", minWidth: "18px" }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {card.company.address}
                </div>
              )}
              {card.company.website && (
                <a href={card.company.website} target="_blank" rel="noopener" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px", minWidth: "18px" }}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  {card.company.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              {card.company.mapUrl && (
                <a href={card.company.mapUrl} target="_blank" rel="noopener" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px", minWidth: "18px" }}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
                  View on Map
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* NAM Footer */}
      <footer style={{ position: "relative", marginTop: "20px", padding: "40px 24px 30px", background: card.colorSecondary, borderTop: "1px solid rgba(255,255,255,0.08)", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", width: "300px", height: "300px", background: `radial-gradient(circle, rgba(${parseInt(accent.slice(1,3),16)},${parseInt(accent.slice(3,5),16)},${parseInt(accent.slice(5,7),16)},0.08) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ marginBottom: "20px" }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: "36px", fontWeight: "800", letterSpacing: "6px", background: accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>NAM</span>
            <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>Noor Al Masafi</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.5)", fontStyle: "italic", marginTop: "6px" }}>Solutions Beyond Expectations</div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px", margin: "20px 0", fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
            {["Digital Printing", "Corporate Gifts", "NFC Cards", "Custom Uniforms"].map((s, i, arr) => (
              <span key={s}>{s}{i < arr.length - 1 && <span style={{ color: accent, margin: "0 6px" }}>•</span>}</span>
            ))}
          </div>

          <a href="https://www.namuae.com" target="_blank" rel="noopener" style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            padding: "14px 32px", background: accentGrad, color: card.colorPrimary,
            fontFamily: "'Outfit',sans-serif", fontSize: "15px", fontWeight: "700",
            borderRadius: "50px", textDecoration: "none", margin: "8px 0 24px",
            boxShadow: `0 4px 20px rgba(${parseInt(accent.slice(1,3),16)},${parseInt(accent.slice(3,5),16)},${parseInt(accent.slice(5,7),16)},0.3)`,
          }}>
            Get Your NFC Card
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", fontSize: "13px", marginBottom: "20px" }}>
            <a href="tel:+971501361811" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>+971 50 136 1811</a>
            <span style={{ color: accent }}>•</span>
            <a href="mailto:info@namuae.com" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>info@namuae.com</a>
          </div>

          <div style={{ paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
            <p style={{ marginBottom: "4px" }}>© 2026 Noor Al Masafi (NAM). All rights reserved.</p>
            <a href="https://www.namuae.com" target="_blank" rel="noopener" style={{ color: accent, fontWeight: "500" }}>www.namuae.com</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glowPulse { 0%,100% { box-shadow:0 0 20px rgba(212,168,83,0.3); } 50% { box-shadow:0 0 40px rgba(212,168,83,0.6); } }
        @keyframes pulseNfc { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.1); } }
        a:hover { opacity: 0.85; }
        button:hover { background: rgba(255,255,255,0.1) !important; border-color: ${accent} !important; transform: translateY(-2px); }
      `}</style>
    </div>
  );
}
