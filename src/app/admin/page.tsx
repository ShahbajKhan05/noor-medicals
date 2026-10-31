
import type { Metadata } from "next";
import Link from "next/link";
import AdminDateTime from "@/components/AdminDateTime";
import AdminDashboardStats from "@/components/AdminDashboardStats";
import AdminRecentActivity from "@/components/AdminRecentActivity";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FlaskConical,
  FileText,
  House,
  Settings,
  Bell,
  Search,
  CheckCircle2,
  UserRound,
  ArrowUpRight,
  Activity,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | NOOR MEDICALS",
  description: "NOOR MEDICALS administration dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Appointments", href: "/admin/appointments", icon: CalendarDays },
  { label: "Patients", href: "/admin/patients", icon: Users },
  { label: "Lab Tests", href: "/admin/lab-tests", icon: FlaskConical },
  { label: "Home Collection", href: "/admin/home-collection", icon: House },
  { label: "Reports", href: "/admin/reports", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const quickActions = [
  {
    title: "Appointments",
    description: "View and manage patient appointments.",
    href: "/admin/appointments",
    icon: CalendarDays,
  },
  {
    title: "Patients",
    description: "Manage patient information and records.",
    href: "/admin/patients",
    icon: UserRound,
  },
  {
    title: "Lab Tests",
    description: "Manage pathology tests and bookings.",
    href: "/admin/lab-tests",
    icon: FlaskConical,
  },
  {
    title: "Home Collection",
    description: "Manage home sample collection requests.",
    href: "/admin/home-collection",
    icon: House,
  },
  {
    title: "Patient Reports",
    description: "Manage and access patient reports.",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Clinic Settings",
    description: "Configure clinic information and details.",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50 lg:flex">

      {/* SIDEBAR */}
      <aside className="w-full shrink-0 border-b border-slate-200 bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">

        {/* CLINIC BRANDING */}
        <div className="flex items-center gap-3 border-b border-slate-100 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-extrabold text-white">
            S+
          </div>

          <div>
            <h1 className="font-extrabold text-slate-900">
              NOOR MEDICALS
            </h1>
            <p className="text-xs text-slate-500">
              Admin Panel · Rewa
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex gap-2 overflow-x-auto p-3 lg:block lg:space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/admin";

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* SIDEBAR INFO */}
        <div className="hidden p-4 lg:block">
          <div className="rounded-2xl bg-blue-50 p-4">
            <Activity className="mb-2 text-blue-600" size={23} />

            <p className="text-sm font-bold text-slate-800">
              Clinic Management
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Manage clinic operations from one dashboard.
            </p>
          </div>

          <Link
            href="/"
            className="mt-4 block rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            ← Back to Website
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="min-w-0 flex-1">

        {/* TOPBAR */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-8">

          <div>
            <p className="text-sm text-slate-500">
              NOOR MEDICALS / Admin
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-slate-900">
              Dashboard Overview
            </h2>
          </div>

          {/* LIVE DATE AND TIME */}
          <AdminDateTime />

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
            >
              <Bell size={19} />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              A
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="mx-auto max-w-7xl space-y-7 p-5 sm:p-8">

          {/* WELCOME SECTION */}
          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Welcome, Admin
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Here is your clinic management overview.
              </p>
            </div>

            <Link
              href="/appointments"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <CalendarDays size={18} />
              Book Appointment
            </Link>
          </div>

          {/* STATISTICS */}
          <AdminDashboardStats />

          {/* QUICK MANAGEMENT */}
          <div>
            <h3 className="mb-4 text-lg font-extrabold text-slate-900">
              Quick Management
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {quickActions.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    href={item.href}
                    key={item.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <Icon size={23} />
                      </span>

                      <ArrowUpRight
                        size={19}
                        className="text-slate-400 transition group-hover:text-blue-600"
                      />
                    </div>

                    <h4 className="font-bold text-slate-900">
                      {item.title}
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

         {/* RECENT ACTIVITY */}
<AdminRecentActivity />


          {/* FOOTER */}
          <footer className="pb-3 text-center text-xs text-slate-400">
            © 2026 NOOR MEDICALS · Admin Dashboard
          </footer>

        </div>
      </section>
    </main>
  );
}
