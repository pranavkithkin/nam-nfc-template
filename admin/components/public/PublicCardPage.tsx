"use client";

// ═══════════════════════════════════════════════════════════════
// PublicCardPage — pixel-perfect NAM NFC template rendered from DB data
// Mirrors the existing index.html / style.css / main.js design exactly
// ═══════════════════════════════════════════════════════════════

import { useEffect } from "react";
import { PLATFORM_COLORS, PlatformIcon } from "@/lib/platformIcons";

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
          { label: "Save Contact", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`, action: "save" },
          { label: "Share", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`, action: "share" },
          card.phone ? { label: "Call", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.21 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>`, action: "call" } : null,
          card.email ? { label: "Email", icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`, action: "email" } : null,
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
            <div style={{ width: "22px", height: "22px", color: accent, display: "flex", alignItems: "center", justifyContent: "center" }} dangerouslySetInnerHTML={{ __html: btn.icon }} />
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
                >
                  <PlatformIcon platform={link.platform} size={20} />
                </div>
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
