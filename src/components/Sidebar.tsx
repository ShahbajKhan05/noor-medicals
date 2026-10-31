
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FlaskConical,
  FileText,
  Settings,
  Home,
  LogOut,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Appointments", href: "/admin/appointments", icon: CalendarDays },
  { label: "Patients", href: "/admin/patients", icon: Users },
  { label: "Lab Tests", href: "/admin/lab-tests", icon: FlaskConical },
  { label: "Reports", href: "/admin/reports", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-slate-950 p-5 text-white">
      <Link href="/admin" className="mb-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-black">
          S+
        </div>
        <div>
          <h2 className="font-bold">Swastik Clinic</h2>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
      </Link>

      <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Main Menu
      </p>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-slate-800 pt-5">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <Home size={19} />
          Patient Website
        </Link>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut size={19} />
          Exit Admin
        </button>
      </div>
    </aside>
  );
}
