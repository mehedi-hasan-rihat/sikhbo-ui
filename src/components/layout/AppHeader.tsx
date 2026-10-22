"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import type { User } from "@/types/auth";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

interface NavLink {
  href: string;
  label: string;
}

interface AppHeaderProps {
  user: User;
  navLinks?: NavLink[];
}

/** First two initials from a full name e.g. "Mehedi Hasan" → "MH" */
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-[11px] font-normal text-muted select-none">
      {initials(name)}
    </span>
  );
}

export function AppHeader({ user, navLinks }: AppHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const prevPath = useRef(pathname);

  // Close on route change
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setMenuOpen(false);
    }
  }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Header bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-border bg-glass backdrop-blur-(--blur-floating)">
        <div className="mx-auto flex h-(--header-height) w-full max-w-344 items-center justify-between px-(--spacing-gutter)">

          {/* Left: brand + desktop nav */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[13px] tracking-[0.12em] uppercase text-foreground hover:text-muted transition-colors"
            >
              Sikhbo
            </Link>

            {/* Desktop nav */}
            {navLinks && navLinks.length > 0 && (
              <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={[
                        "rounded-full px-3 py-1.5 text-[13px] transition-colors",
                        active
                          ? "bg-foreground text-white"
                          : "text-muted hover:bg-control hover:text-foreground",
                      ].join(" ")}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right: avatar + logout (desktop) + hamburger (mobile) */}
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <Avatar name={user.name} />
              <LogoutButton />
            </div>

            {/* Hamburger — mobile only */}
            <button
              className="flex size-8 items-center justify-center rounded-xl text-muted hover:bg-control hover:text-foreground transition-colors md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Full-screen mobile overlay ───────────────────────────────── */}
      {menuOpen && (
        <div
          className="fixed inset-x-0 bottom-0 z-10 flex flex-col bg-canvas md:hidden"
          style={{ top: "var(--header-height)" }}
          role="dialog"
          aria-label="Mobile navigation"
        >
          {/* Large centered nav links */}
          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {navLinks?.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "text-[28px] leading-8 tracking-[-0.03em] transition-colors",
                    active ? "text-foreground" : "text-muted hover:text-foreground",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User + logout pinned to bottom */}
          <div className="border-t border-border px-(--spacing-gutter) py-6 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Avatar name={user.name} />
              <span className="text-[13px] text-muted">{user.name}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      )}
    </>
  );
}
