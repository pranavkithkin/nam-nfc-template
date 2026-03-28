"use client";

import { useEffect, useState } from "react";

interface Company {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  logoUrl?: string;
  _count: { cards: number };
}

const EMPTY: Omit<Company, "id" | "_count"> = {
  name: "", industry: "", website: "", logoUrl: "",
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; company?: Company }>({ open: false });
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchCompanies() {
    const res = await fetch("/api/companies");
    const data = await res.json();
    setCompanies(data);
    setLoading(false);
  }

  useEffect(() => { fetchCompanies(); }, []);

  function openCreate() {
    setForm(EMPTY);
    setModal({ open: true });
  }

  function openEdit(c: Company) {
    setForm({ name: c.name, industry: c.industry || "", website: c.website || "", logoUrl: c.logoUrl || "" });
    setModal({ open: true, company: c });
  }

  async function saveCompany() {
    setSaving(true);
    const url = modal.company ? `/api/companies/${modal.company.id}` : "/api/companies";
    const method = modal.company ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setModal({ open: false });
    fetchCompanies();
  }

  async function deleteCompany(id: string) {
    if (!confirm("Delete this company? Cards will be unassigned.")) return;
    setDeletingId(id);
    await fetch(`/api/companies/${id}`, { method: "DELETE" });
    setCompanies((p) => p.filter((c) => c.id !== id));
    setDeletingId(null);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Companies</h1>
          <p className="text-sm text-white/45 mt-0.5">Group NFC cards by client or organisation</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gold-gradient text-navy font-heading font-bold text-sm px-4 py-2.5 rounded-xl hover:shadow-gold transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          New Company
        </button>
      </div>

      <div className="nam-surface rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.07]">
              {["Company", "Industry", "Cards", "Website", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-white/35 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-16 text-center text-sm text-white/30 animate-pulse">Loading…</td></tr>
            ) : companies.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-16 text-center">
                <p className="text-sm text-white/30">No companies yet.</p>
                <button onClick={openCreate} className="mt-3 text-gold text-sm hover:underline">Create your first company →</button>
              </td></tr>
            ) : companies.map((company) => (
              <tr key={company.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center font-heading font-bold text-gold text-xs">
                      {company.name[0]}
                    </div>
                    <span className="text-sm font-semibold text-white">{company.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-white/50">{company.industry || "—"}</td>
                <td className="px-5 py-4">
                  <span className="text-sm font-semibold text-gold">{company._count.cards}</span>
                </td>
                <td className="px-5 py-4">
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noopener" className="text-xs text-white/40 hover:text-gold font-mono transition-colors">
                      {company.website.replace(/^https?:\/\//, "")}
                    </a>
                  ) : "—"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(company)}
                      className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCompany(company.id)}
                      disabled={deletingId === company.id}
                      className="text-xs text-white/30 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-all"
                    >
                      {deletingId === company.id ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-navy-surface border border-white/10 rounded-2xl w-full max-w-md p-6 animate-fade-in-up">
            <h2 className="font-heading font-bold text-lg text-white mb-6">
              {modal.company ? "Edit Company" : "New Company"}
            </h2>

            <div className="space-y-4">
              {[
                { label: "Company Name *", key: "name", placeholder: "Apex Ventures" },
                { label: "Industry", key: "industry", placeholder: "Real Estate, Technology…" },
                { label: "Website", key: "website", placeholder: "https://company.ae" },
                { label: "Logo URL", key: "logoUrl", placeholder: "https://…/logo.png" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">{label}</label>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-gold/50 transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => setModal({ open: false })}
                className="px-4 py-2.5 text-sm text-white/50 border border-white/10 rounded-xl hover:text-white hover:border-white/25 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveCompany}
                disabled={saving || !form.name}
                className="px-4 py-2.5 text-sm bg-gold-gradient text-navy font-bold rounded-xl hover:shadow-gold transition-all disabled:opacity-50"
              >
                {saving ? "Saving…" : modal.company ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
