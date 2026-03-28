"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const NAV = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4.5 h-4.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Cards",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4.5 h-4.5">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    label: "Companies",
    href: "/companies",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4.5 h-4.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

interface AdminShellProps {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null; role?: string | null };
}

export default function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);

  return (
    <div className="min-h-screen bg-navy flex">
      {/* ─── Sidebar ─── */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-white/[0.07] bg-navy-deep">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-white/[0.07]">
          <span className="font-heading font-black text-2xl tracking-[5px] gold-text">NAM</span>
          <span className="ml-2 text-[10px] text-white/40 uppercase tracking-widest font-medium">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-gold/10 text-gold border border-gold/20"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={active ? "text-gold" : "text-white/40"}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/[0.07]">
          <div className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <p className="text-xs font-semibold text-white/80 truncate">{user.name}</p>
            <p className="text-[10px] text-white/35 truncate mt-0.5">{user.email}</p>
            <span className={`inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
              user.role === "SUPER_ADMIN"
                ? "bg-gold/15 text-gold"
                : "bg-white/8 text-white/50"
            }`}>
              {user.role === "SUPER_ADMIN" ? "Super Admin" : "Editor"}
            </span>
          </div>

          <button
            onClick={async () => {
              setSigningOut(true);
              await signOut({ callbackUrl: "/login" });
            }}
            disabled={signingOut}
            className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
