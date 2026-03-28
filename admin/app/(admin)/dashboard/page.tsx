"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import QRModal from "@/components/admin/QRModal";

interface Card {
  id: string;
  slug: string;
  status: "DRAFT" | "ACTIVE" | "INACTIVE";
  name: string;
  title?: string;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  company?: { id: string; name: string; logoUrl?: string };
}

interface Company {
  id: string;
  name: string;
}

const STATUS_COLORS = {
  ACTIVE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  DRAFT: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  INACTIVE: "bg-white/8 text-white/40 border-white/10",
};

export default function DashboardPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [qrCard, setQrCard] = useState<{ slug: string; name: string } | null>(null);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_BASE_URL || "";

  const fetchCards = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filterStatus) params.set("status", filterStatus);
    if (filterCompany) params.set("companyId", filterCompany);

    const res = await fetch(`/api/cards?${params}`);
    const data = await res.json();
    setCards(data);
    setLoading(false);
  }, [search, filterStatus, filterCompany]);

  useEffect(() => {
    fetch("/api/companies").then((r) => r.json()).then(setCompanies);
  }, []);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(fetchCards, 300);
    return () => clearTimeout(t);
  }, [fetchCards]);

  const stats = {
    total: cards.length,
    active: cards.filter((c) => c.status === "ACTIVE").length,
    draft: cards.filter((c) => c.status === "DRAFT").length,
    inactive: cards.filter((c) => c.status === "INACTIVE").length,
  };

  async function deleteCard(id: string) {
    if (!confirm("Delete this card? This cannot be undone.")) return;
    setDeletingId(id);
    await fetch(`/api/cards/${id}`, { method: "DELETE" });
    setCards((prev) => prev.filter((c) => c.id !== id));
    setDeletingId(null);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-white/45 mt-0.5">Manage all NFC card landing pages</p>
        </div>
        <Link
          href="/cards/new"
          className="flex items-center gap-2 bg-gold-gradient text-navy font-heading font-bold text-sm px-4 py-2.5 rounded-xl hover:shadow-gold transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          New Card
        </Link>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Cards", value: stats.total, color: "text-white" },
          { label: "Active", value: stats.active, color: "text-emerald-400" },
          { label: "Draft", value: stats.draft, color: "text-amber-400" },
          { label: "Inactive", value: stats.inactive, color: "text-white/40" },
        ].map((s) => (
          <div key={s.label} className="nam-surface rounded-xl px-5 py-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`font-heading text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, slug, email…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold/50 transition-all"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <select
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold/50 transition-all"
        >
          <option value="">All Companies</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Cards Table */}
      <div className="nam-surface rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.07]">
              {["Card", "Company", "Status", "Public URL", "Updated", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-white/35 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-sm text-white/30 animate-pulse">
                  Loading…
                </td>
              </tr>
            ) : cards.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <p className="text-sm text-white/30">No cards found.</p>
                  <Link href="/cards/new" className="mt-3 inline-block text-gold text-sm hover:underline">
                    Create your first card →
                  </Link>
                </td>
              </tr>
            ) : (
              cards.map((card) => (
                <tr
                  key={card.id}
                  className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Card */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center font-heading font-bold text-gold text-xs shrink-0">
                        {card.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{card.name}</p>
                        <p className="text-xs text-white/40">{card.title || "—"}</p>
                      </div>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-white/60">{card.company?.name || "—"}</span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[card.status]}`}>
                      {card.status}
                    </span>
                  </td>

                  {/* Public URL */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/c/${card.slug}`}
                        target="_blank"
                        rel="noopener"
                        className="text-xs font-mono text-white/50 hover:text-gold transition-colors truncate max-w-[160px]"
                      >
                        /c/{card.slug}
                      </a>
                      <button
                        onClick={() => setQrCard({ slug: card.slug, name: card.name })}
                        title="Show QR Code"
                        className="text-white/25 hover:text-gold transition-colors shrink-0"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                          <rect x="3" y="3" width="7" height="7" rx="1"/>
                          <rect x="14" y="3" width="7" height="7" rx="1"/>
                          <rect x="3" y="14" width="7" height="7" rx="1"/>
                          <path d="M14 14h.01M14 17h3M17 14v3M20 17v.01M20 20h.01" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>

                  {/* Updated */}
                  <td className="px-5 py-4">
                    <span className="text-xs text-white/35">
                      {new Date(card.updatedAt).toLocaleDateString("en-AE", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/cards/${card.id}/edit`}
                        className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Edit
                      </Link>
                      <a
                        href={`/c/${card.slug}?preview=1`}
                        target="_blank"
                        rel="noopener"
                        className="text-xs text-white/50 hover:text-gold border border-white/10 hover:border-gold/30 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Preview
                      </a>
                      <button
                        onClick={() => setQrCard({ slug: card.slug, name: card.name })}
                        className="text-xs text-white/50 hover:text-gold border border-white/10 hover:border-gold/30 px-3 py-1.5 rounded-lg transition-all"
                        title="QR Code"
                      >
                        QR
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(`${window.location.origin}/c/${card.slug}`)}
                        className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-lg transition-all"
                        title="Copy link"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => deleteCard(card.id)}
                        disabled={deletingId === card.id}
                        className="text-xs text-white/30 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
                        title="Delete"
                      >
                        {deletingId === card.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {qrCard && (
        <QRModal
          slug={qrCard.slug}
          name={qrCard.name}
          baseUrl={baseUrl}
          onClose={() => setQrCard(null)}
        />
      )}
    </div>
  );
}
