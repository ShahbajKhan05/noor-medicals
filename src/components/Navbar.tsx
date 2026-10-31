"use client";
import Image from "next/image"; // 👈 Ye line add karein
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  CalendarDays,
  Home,
  FlaskConical,
  FileText,
  ChevronRight,
  ShieldCheck,
  Bell,
  UserRound,
  User,
  ClipboardList,
  LogOut,
  CheckCheck,
} from "lucide-react";

import { storage } from "@/lib/storage";
import type {
  AppNotification,
  Patient,
} from "@/types";

const navLinks = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Appointments",
    href: "/appointments",
    icon: CalendarDays,
  },
  {
    label: "Lab Tests",
    href: "/lab-tests",
    icon: FlaskConical,
  },
  {
    label: "Home Collection",
    href: "/home-collection",
    icon: ClipboardList,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileText,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] =
    useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [patient, setPatient] =
    useState<Patient | null>(null);

  const [notifications, setNotifications] =
    useState<AppNotification[]>([]);

  useEffect(() => {
    loadNavbarData();

    window.addEventListener(
      "storage",
      loadNavbarData
    );

    window.addEventListener(
      "noor-data-updated",
      loadNavbarData
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadNavbarData
      );

      window.removeEventListener(
        "noor-data-updated",
        loadNavbarData
      );
    };
  }, []);

  function loadNavbarData() {
    try {
      const currentPatient =
        storage.getCurrentPatient();

      setPatient(currentPatient);

      if (currentPatient) {
        setNotifications(
          storage.getPatientNotifications(
            currentPatient.id
          )
        );
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error(
        "Unable to load navbar data:",
        error
      );
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  function closeAllMenus() {
    setMenuOpen(false);
    setNotificationOpen(false);
    setProfileOpen(false);
  }

  function markAllAsRead() {
    if (!patient) return;

    storage.markAllNotificationsAsRead(
      patient.id
    );

    loadNavbarData();

    window.dispatchEvent(
      new Event("noor-data-updated")
    );
  }

  function handleLogout() {
    storage.logoutPatient();

    setPatient(null);
    setNotifications([]);

    closeAllMenus();

    router.push("/patient/login");

    window.dispatchEvent(
      new Event("noor-data-updated")
    );
  }

  function formatNotificationDate(date: string) {
    try {
      return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(date));
    } catch {
      return "Recently";
    }
  }

  return (
    <header className="sticky top-3 z-50 mx-auto w-full max-w-7xl px-3 sm:px-6">
      <nav className="relative flex items-center justify-between rounded-2xl border border-white/80 bg-white/90 px-3 py-3 shadow-lg backdrop-blur-2xl sm:px-5">

        {/* LOGO */}
                <Link
          href="/"
          onClick={closeAllMenus}
          className="flex min-w-0 items-center gap-2.5"
        >
          {/* Naya Logo */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
            <Image
              src="/logo.png"
              alt="Noor Medicals Logo"
              width={44}
              height={44}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-extrabold text-slate-900 sm:text-lg">
              Noor Medicals
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

            const active =
              pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={
                  active ? "page" : undefined
                }
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

          {/* NOTIFICATIONS */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationOpen(
                  (current) => !current
                );

                setProfileOpen(false);
              }}
              aria-label="Notifications"
              aria-expanded={notificationOpen}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Bell size={19} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9
                    ? "9+"
                    : unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                <div className="flex items-center justify-between border-b border-slate-100 p-4">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Notifications
                    </h3>

                    <p className="text-xs text-slate-500">
                      Your latest booking updates
                    </p>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      <CheckCheck size={15} />
                      Read all
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell
                        size={32}
                        className="mx-auto mb-3 text-slate-300"
                      />

                      <p className="font-semibold text-slate-700">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    notifications.map(
                      (notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => {
                            storage.markNotificationAsRead(
                              notification.id
                            );

                            loadNavbarData();
                          }}
                          className={`w-full border-b border-slate-100 p-4 text-left ${
                            notification.isRead
                              ? "bg-white"
                              : "bg-blue-50/60"
                          }`}
                        >
                          <p className="text-sm font-bold text-slate-800">
                            {notification.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {notification.message}
                          </p>

                          <p className="mt-2 text-[11px] text-slate-400">
                            {formatNotificationDate(
                              notification.createdAt
                            )}
                          </p>
                        </button>
                      )
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* PATIENT ACCOUNT */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen(
                  (current) => !current
                );

                setNotificationOpen(false);
              }}
              aria-label="Patient account"
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <UserRound size={16} />
              </span>

              <span className="max-w-28 truncate">
                {patient?.name || "Account"}
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                <div className="border-b border-slate-100 p-4">
                  <p className="font-bold text-slate-900">
                    {patient?.name || "Patient Account"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {patient?.phone ||
                      "Please login to continue"}
                  </p>
                </div>

                <div className="p-2">

                  {patient ? (
                    <>
                      <Link
                        href="/patient/profile"
                        onClick={closeAllMenus}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <User size={18} />
                        My Profile
                      </Link>

                      <Link
                        href="/patient/appointments"
                        onClick={closeAllMenus}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <CalendarDays size={18} />
                        My Appointments
                      </Link>

                      <Link
                        href="/lab-tests"
                        onClick={closeAllMenus}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <FlaskConical size={18} />
                        Lab Tests
                      </Link>

                      <Link
                        href="/home-collection"
                        onClick={closeAllMenus}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <ClipboardList size={18} />
                        Home Collection
                      </Link>

                      <div className="my-2 border-t border-slate-100" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/patient/login"
                      onClick={closeAllMenus}
                      className="flex items-center gap-3 rounded-xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      <UserRound size={18} />
                      Patient Login
                    </Link>
                  )}

                </div>
              </div>
            )}
          </div>

          {/* ADMIN */}
          <Link
            href="/admin"
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition ${
              pathname.startsWith("/admin")
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            <ShieldCheck size={17} />
            Admin
          </Link>

          {/* BOOK APPOINTMENT */}
          <Link
            href="/appointments"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700"
          >
            Book
            <ChevronRight size={17} />
          </Link>

        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-2 lg:hidden">

          <Link
            href={
              patient
                ? "/patient/profile"
                : "/patient/login"
            }
            aria-label="Patient profile"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
          >
            <UserRound size={19} />
          </Link>

          <button
            type="button"
            aria-label={
              menuOpen
                ? "Close menu"
                : "Open menu"
            }
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700"
          >
            {menuOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>

        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+10px)] rounded-2xl border border-white/80 bg-white p-3 shadow-2xl lg:hidden">

            <Link
              href={
                patient
                  ? "/patient/profile"
                  : "/patient/login"
              }
              onClick={closeAllMenus}
              className="mb-3 flex items-center gap-3 rounded-xl bg-blue-50 p-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <UserRound size={21} />
              </span>

              <div>
                <p className="font-bold text-slate-900">
                  {patient?.name || "Patient Account"}
                </p>

                <p className="text-xs text-slate-500">
                  {patient?.phone ||
                    "Login to manage your account"}
                </p>
              </div>
            </Link>

            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;

                const active =
                  pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeAllMenus}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-blue-50"
                    }`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {patient && (
              <div className="mt-3 space-y-1 border-t border-slate-200 pt-3">

                <Link
                  href="/patient/appointments"
                  onClick={closeAllMenus}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50"
                >
                  <CalendarDays size={18} />
                  My Appointments
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>
            )}

            <Link
              href="/admin"
              onClick={closeAllMenus}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700"
            >
              <ShieldCheck size={18} />
              Admin
            </Link>

            <Link
              href="/appointments"
              onClick={closeAllMenus}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"
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