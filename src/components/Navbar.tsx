"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  CalendarDays,
  Home,
  FlaskConical,
  FileText,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Appointments", href: "/appointments", icon: CalendarDays },
  { label: "Lab Tests", href: "/lab-tests", icon: FlaskConical },
  { label: "Home Collection", href: "/home-collection", icon: Home },
  { label: "Reports", href: "/reports", icon: FileText },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-3 z-50 mx-auto w-full max-w-7xl px-3 sm:px-6">
      <nav className="relative flex items-center justify-between rounded-2xl border border-white/80 bg-white/85 px-3 py-3 shadow-lg backdrop-blur-2xl sm:px-5">
        {/* BRAND */}
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-extrabold text-white shadow-lg">
            S+
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-extrabold text-slate-900 sm:text-lg">
              Swastik Clinic
            </h1>
            <p className="text-[11px] font-medium text-slate-500">
              Rewa, Madhya Pradesh
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-xl px-2.5 py-2.5 text-sm font-semibold transition lg:px-3 ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                <Icon size={17} />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/admin"
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition ${
              pathname.startsWith("/admin")
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            <ShieldCheck size={17} />
            Admin Login
          </Link>

          <Link
            href="/appointments"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700"
          >
            Book Appointment
            <ChevronRight size={17} />
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 md:hidden"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        {/* MOBILE DROPDOWN */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="absolute left-0 right-0 top-[calc(100%+10px)] rounded-2xl border border-white/80 bg-white/95 p-3 shadow-2xl backdrop-blur-2xl md:hidden"
          >
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <span className="rounded-lg bg-blue-100 p-2 text-blue-600">
                      <Icon size={18} />
                    </span>
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* MOBILE ADMIN LOGIN */}
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700"
            >
              <ShieldCheck size={18} />
              Admin Login
            </Link>

            <Link
              href="/appointments"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"
            >
              <CalendarDays size={17} />
              Book Appointment
              <ChevronRight size={17} />
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}