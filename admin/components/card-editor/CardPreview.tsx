"use client";

// CardPreview — renders the NAM card template in-place using React.
// Mirrors the exact structure of the public /c/[slug] page for real-time preview.

import { PLATFORM_COLORS, PlatformIcon } from "@/lib/platformIcons";
interface SLink { platform: string; url: string; label: string; order: number }
interface Company { id: string; name: string }

interface CardFormData {
  name: string; title: string; bio: string; phone: string; email: string;
  website: string; location: string; avatarUrl: string; coverUrl: string;
  colorPrimary: string; colorSecondary: string; colorAccent: string;
  colorAccentHover: string; companyId: string; socialLinks: SLink[];
}

interface Props {
  form: CardFormData;
  companies: Company[];
}

export default function CardPreview({ form, companies }: Props) {
  const company = companies.find((c) => c.id === form.companyId);
  const initials = form.name
    .split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) || "?";
  const accentGrad = `linear-gradient(135deg, ${form.colorAccent}, ${form.colorAccentHover})`;

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: form.colorPrimary,
        color: "#fff",
        minHeight: "100%",
        fontSize: "14px",
        lineHeight: "1.6",
      }}
    >
      {/* NAM Top Bar */}
      <div style={{
        background: "rgba(10,22,40,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}>
        <span style={{ fontSize: "11px", letterSpacing: "1.5px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
          Powered by <strong style={{ color: form.colorAccent }}>NAM</strong>
        </span>
      </div>

      {/* Cover */}
      <div style={{ position: "relative" }}>
        <div style={{
          height: "120px",
          background: form.coverUrl ? `url(${form.coverUrl}) center/cover` : form.colorSecondary,
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to bottom, transparent 30%, ${form.colorPrimary} 100%)`,
          }} />
        </div>

        {/* Avatar */}
        <div style={{ textAlign: "center", marginTop: "-50px", position: "relative", padding: "0 16px" }}>
          <div style={{
            display: "inline-block",
            padding: "3px",
            borderRadius: "50%",
            background: accentGrad,
            marginBottom: "10px",
          }}>
            {form.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.avatarUrl}
                alt=""
                style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: `3px solid ${form.colorPrimary}` }}
              />
            ) : (
              <div style={{
                width: "90px", height: "90px", borderRadius: "50%",
                background: form.colorSecondary, border: `3px solid ${form.colorPrimary}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Outfit', sans-serif", fontSize: "28px", fontWeight: "800", color: form.colorAccent,
              }}>
                {initials}
              </div>
            )}
          </div>

          {form.name && (
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "22px", fontWeight: "800", margin: "0 0 3px" }}>
              {form.name}
            </h1>
          )}
          {form.title && (
            <p style={{ fontSize: "13px", color: form.colorAccent, fontWeight: "500", margin: "0 0 2px" }}>{form.title}</p>
          )}
          {company && (
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: "0 0 8px" }}>{company.name}</p>
          )}
          {form.bio && (
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", maxWidth: "320px", margin: "8px auto 0", lineHeight: "1.6" }}>
              {form.bio}
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {(form.phone || form.email) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", padding: "16px" }}>
          {["Save", "Share", form.phone ? "Call" : null, form.email ? "Email" : null].filter(Boolean).map((a) => (
            <div key={a} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
              padding: "12px 4px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "12px",
              fontSize: "10px", fontWeight: "500",
            }}>
              <div style={{ width: "20px", height: "20px", background: form.colorAccent, borderRadius: "4px" }} />
              {a}
            </div>
          ))}
        </div>
      )}

      {/* Social Links */}
      {form.socialLinks.length > 0 && (
        <div style={{ padding: "8px 16px 16px" }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: "700", marginBottom: "10px", color: form.colorAccent }}>
            Connect With Me
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {form.socialLinks.slice(0, 4).map((link, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
              }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "8px",
                  background: PLATFORM_COLORS[link.platform] || PLATFORM_COLORS.website,
                  flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <PlatformIcon platform={link.platform} size={16} />
                </div>
                <span style={{ flex: 1, fontSize: "13px", fontWeight: "500" }}>{link.label || link.platform}</span>
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px" }}>›</span>
              </div>
            ))}
            {form.socialLinks.length > 4 && (
              <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
                +{form.socialLinks.length - 4} more
              </p>
            )}
          </div>
        </div>
      )}

      {/* NAM Footer */}
      <div style={{
        marginTop: "16px", padding: "24px 16px 20px",
        background: form.colorSecondary,
        borderTop: "1px solid rgba(255,255,255,0.08)",
        textAlign: "center",
      }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "22px", fontWeight: "800", letterSpacing: "5px", background: accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          NAM
        </p>
        <p style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
          Noor Al Masafi
        </p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          marginTop: "12px", padding: "10px 20px",
          background: accentGrad,
          borderRadius: "50px", fontSize: "11px", fontWeight: "700",
          color: form.colorPrimary,
        }}>
          Get Your NFC Card →
        </div>
      </div>
    </div>
  );
}
