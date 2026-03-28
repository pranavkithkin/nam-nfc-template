"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SocialLinksEditor from "@/components/card-editor/SocialLinksEditor";
import ThemePicker from "@/components/card-editor/ThemePicker";
import ImageUploader from "@/components/card-editor/ImageUploader";
import CardPreview from "@/components/card-editor/CardPreview";

interface Company { id: string; name: string }
interface SocialLink { platform: string; url: string; label: string; order: number }

interface CardFormData {
  slug: string;
  status: "DRAFT" | "ACTIVE" | "INACTIVE";
  name: string;
  title: string;
  bio: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  avatarUrl: string;
  coverUrl: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorAccentHover: string;
  companyId: string;
  socialLinks: SocialLink[];
}

const DEFAULT_FORM: CardFormData = {
  slug: "",
  status: "DRAFT",
  name: "",
  title: "",
  bio: "",
  phone: "",
  email: "",
  website: "",
  location: "",
  avatarUrl: "",
  coverUrl: "",
  colorPrimary: "#0a1628",
  colorSecondary: "#111d33",
  colorAccent: "#d4a853",
  colorAccentHover: "#f0c56e",
  companyId: "",
  socialLinks: [],
};

type Tab = "profile" | "media" | "theme" | "social";

export default function CardEditorPage({
  cardId,
  initialData,
}: {
  cardId?: string;
  initialData?: Partial<CardFormData>;
}) {
  const [form, setForm] = useState<CardFormData>({ ...DEFAULT_FORM, ...initialData });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("profile");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/companies").then((r) => r.json()).then(setCompanies);
  }, []);

  function update(field: keyof CardFormData, value: unknown) {
    setForm((p) => ({ ...p, [field]: value }));
    setSaved(false);
  }

  async function save(publish?: boolean) {
    setSaving(true);
    setError("");
    if (publish) update("status", "ACTIVE");

    const payload = { ...form, ...(publish ? { status: "ACTIVE" } : {}) };

    try {
      const res = await fetch(
        cardId ? `/api/cards/${cardId}` : "/api/cards",
        {
          method: cardId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        setSaving(false);
        return;
      }

      const saved_card = await res.json();
      setSaved(true);
      setSaving(false);

      if (!cardId) {
        router.replace(`/cards/${saved_card.id}/edit`);
      }
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "media", label: "Media" },
    { key: "theme", label: "Theme" },
    { key: "social", label: "Social Links" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ─── Editor Panel ─── */}
      <div className="w-[520px] shrink-0 flex flex-col border-r border-white/[0.07] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-lg text-white">
              {cardId ? "Edit Card" : "New Card"}
            </h1>
            {form.slug && (
              <p className="text-xs font-mono text-white/35 mt-0.5">/c/{form.slug}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/70 focus:outline-none focus:border-gold/40"
            >
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <button
              onClick={() => save()}
              disabled={saving}
              className="text-xs border border-white/15 text-white/60 hover:text-white hover:border-white/30 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
            >
              {saving ? "Saving…" : saved ? "✓ Saved" : "Save Draft"}
            </button>

            <button
              onClick={() => save(true)}
              disabled={saving}
              className="text-xs bg-gold-gradient text-navy font-bold px-3 py-1.5 rounded-lg hover:shadow-gold transition-all disabled:opacity-50"
            >
              Publish
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-0 px-6 pt-4 border-b border-white/[0.07]">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 pb-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                tab === t.key
                  ? "text-gold border-gold"
                  : "text-white/40 border-transparent hover:text-white/70"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {tab === "profile" && (
            <>
              <Field label="Full Name *">
                <Input value={form.name} onChange={(v) => update("name", v)} placeholder="Sarah Al-Rashidi" />
              </Field>
              <Field label="Slug (URL identifier) *">
                <Input
                  value={form.slug}
                  onChange={(v) => update("slug", v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
                  placeholder="sarah-alrashidi"
                  mono
                />
                <p className="text-xs text-white/30 mt-1">namuae.com/c/{form.slug || "your-slug"}</p>
              </Field>
              <Field label="Job Title">
                <Input value={form.title} onChange={(v) => update("title", v)} placeholder="Chief Executive Officer" />
              </Field>
              <Field label="Company (for display)">
                <select
                  value={form.companyId}
                  onChange={(e) => update("companyId", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold/50 transition-all"
                >
                  <option value="">No company</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Bio">
                <textarea
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  placeholder="A short professional bio…"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-gold/50 transition-all resize-none"
                />
              </Field>
              <Field label="Phone">
                <Input value={form.phone} onChange={(v) => update("phone", v)} placeholder="+971 50 000 0000" />
              </Field>
              <Field label="Email">
                <Input value={form.email} onChange={(v) => update("email", v)} placeholder="email@company.com" type="email" />
              </Field>
              <Field label="Website">
                <Input value={form.website} onChange={(v) => update("website", v)} placeholder="https://company.com" />
              </Field>
              <Field label="Location">
                <Input value={form.location} onChange={(v) => update("location", v)} placeholder="Business Bay, Dubai, UAE" />
              </Field>
            </>
          )}

          {tab === "media" && (
            <>
              <ImageUploader
                label="Profile Photo"
                hint="Square image — any size, will be cropped & compressed"
                value={form.avatarUrl}
                onChange={(url) => update("avatarUrl", url)}
                folder="avatars"
                aspect={1}
              />
              <ImageUploader
                label="Cover / Banner"
                hint="Wide image — any size, will be cropped & compressed"
                value={form.coverUrl}
                onChange={(url) => update("coverUrl", url)}
                folder="covers"
                aspect={3}
              />
            </>
          )}

          {tab === "theme" && (
            <ThemePicker
              colors={{
                primary: form.colorPrimary,
                secondary: form.colorSecondary,
                accent: form.colorAccent,
                accentHover: form.colorAccentHover,
              }}
              onChange={(colors) => {
                update("colorPrimary", colors.primary);
                update("colorSecondary", colors.secondary);
                update("colorAccent", colors.accent);
                update("colorAccentHover", colors.accentHover);
              }}
            />
          )}

          {tab === "social" && (
            <SocialLinksEditor
              links={form.socialLinks}
              onChange={(links) => update("socialLinks", links)}
            />
          )}
        </div>
      </div>

      {/* ─── Live Preview ─── */}
      <div className="flex-1 bg-navy-deep overflow-hidden flex flex-col">
        <div className="px-5 py-3 border-b border-white/[0.07] flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-white/40">Live Preview</span>
          {form.slug && (
            <a
              href={`/c/${form.slug}?preview=1`}
              target="_blank"
              rel="noopener"
              className="ml-auto text-xs text-gold hover:underline"
            >
              Open in new tab ↗
            </a>
          )}
        </div>
        <div className="flex-1 overflow-auto flex items-start justify-center py-6 px-4">
          <div className="w-[375px] bg-[#0a1628] rounded-2xl overflow-hidden shadow-card border border-white/10" style={{ minHeight: "80vh" }}>
            <CardPreview form={form} companies={companies} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Field / Input helpers ───

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  mono,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  mono?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all ${mono ? "font-mono" : ""}`}
    />
  );
}
