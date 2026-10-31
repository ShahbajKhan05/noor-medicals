
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  Search,
  Phone,
  Clock,
  UserRound,
  Trash2,
  RefreshCw,
  ClipboardList,
} from "lucide-react";

import { storage } from "@/lib/storage";
import type { Appointment, AppointmentStatus } from "@/types";

const statusOptions: AppointmentStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

const statusStyles: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAppointments = useCallback(() => {
    try {
      setError("");

      const records = storage.getAppointments();

      const sorted = [...records].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return (
          (Number.isFinite(dateB) ? dateB : 0) -
          (Number.isFinite(dateA) ? dateA : 0)
        );
      });

      setAppointments(sorted);
    } catch (err) {
      console.error("Unable to load appointments:", err);
      setError("Appointments load nahi ho paye. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();

    window.addEventListener("storage", loadAppointments);
    window.addEventListener("focus", loadAppointments);

    return () => {
      window.removeEventListener("storage", loadAppointments);
      window.removeEventListener("focus", loadAppointments);
    };
  }, [loadAppointments]);

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesSearch =
        (appointment.patientName || "").toLowerCase().includes(query) ||
        (appointment.phone || "").includes(query) ||
        (appointment.reason || "").toLowerCase().includes(query);

      const matchesStatus =
        filter === "all" || appointment.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, filter]);

  const counts = useMemo(
    () => ({
      all: appointments.length,
      pending: appointments.filter((a) => a.status === "pending").length,
      confirmed: appointments.filter((a) => a.status === "confirmed").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
    }),
    [appointments]
  );

  function updateStatus(id: string, status: AppointmentStatus) {
    try {
      const updated = appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment
      );

      storage.saveAppointments(updated);
      setAppointments(updated);
    } catch (err) {
      console.error("Unable to update appointment:", err);
      alert("Appointment update nahi ho paya.");
    }
  }

  function deleteAppointment(id: string) {
    const confirmed = window.confirm(
      "Kya aap is appointment ko permanently delete karna chahte hain?"
    );

    if (!confirmed) return;

    try {
      const updated = appointments.filter(
        (appointment) => appointment.id !== id
      );

      storage.saveAppointments(updated);
      setAppointments(updated);
    } catch (err) {
      console.error("Unable to delete appointment:", err);
      alert("Appointment delete nahi ho paya.");
    }
  }

  function formatDate(value: string) {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const statCards = [
    {
      label: "Total",
      value: counts.all,
      color: "text-slate-900",
      bg: "bg-slate-50",
    },
    {
      label: "Pending",
      value: counts.pending,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Confirmed",
      value: counts.confirmed,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Completed",
      value: counts.completed,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Cancelled",
      value: counts.cancelled,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-slate-50 p-3 sm:p-5 lg:p-7">
      <div className="mx-auto w-full min-w-0 max-w-7xl">

        {/* BACK BUTTON */}
        <Link
          href="/admin"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* PAGE HEADER */}
        <header className="mb-6 flex min-w-0 flex-col gap-4 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Appointment Management
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              View and manage all clinic appointment requests.
            </p>
          </div>

          <button
            type="button"
            onClick={loadAppointments}
            className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        {/* STATISTICS */}
        <section className="mb-6 grid min-w-0 grid-cols-1 gap-3 min-[400px]:grid-cols-2 xl:grid-cols-5">
          {statCards.map((item) => (
            <div
              key={item.label}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}
              >
                <ClipboardList size={20} className={item.color} />
              </div>

              <p className="text-sm text-slate-500">{item.label}</p>

              <p
                className={`mt-2 text-2xl font-extrabold tabular-nums sm:text-3xl ${item.color}`}
              >
                {item.value}
              </p>
            </div>
          ))}
        </section>

        {/* APPOINTMENTS */}
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
              All Appointments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search, filter, update or delete appointment requests.
            </p>
          </div>

          {/* SEARCH AND FILTER */}
          <div className="mb-5 flex min-w-0 flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search patient, phone or reason..."
                aria-label="Search appointments"
                className="min-h-12 w-full min-w-0 rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter appointments by status"
              className="min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 lg:w-56"
            >
              <option value="all">All Appointments</option>

              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="mb-4 break-words rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="py-12 text-center text-slate-500">
              Loading appointments...
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="py-14 text-center">
              <CalendarDays
                size={42}
                className="mx-auto mb-3 text-slate-300"
              />

              <h2 className="font-bold text-slate-700">
                No appointments found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {search || filter !== "all"
                  ? "Try changing your search or filter."
                  : "New appointment requests will appear here."}
              </p>

              {(search || filter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid min-w-0 grid-cols-1 gap-4 2xl:grid-cols-2">
              {filteredAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="min-w-0 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:shadow-sm sm:p-5"
                >
                  {/* PATIENT DETAILS */}
                  <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="shrink-0 rounded-xl bg-blue-50 p-2.5 text-blue-600">
                          <UserRound size={21} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="break-words font-bold text-slate-900">
                            {appointment.patientName || "Unknown patient"}
                          </h3>

                          <p className="mt-1 break-all text-xs text-slate-400">
                            ID: {appointment.id}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          statusStyles[appointment.status] ||
                          statusStyles.pending
                        }`}
                      >
                        {appointment.status || "pending"}
                      </span>
                    </div>

                    {/* DETAILS GRID */}
                    <div className="grid min-w-0 grid-cols-1 gap-4 text-sm text-slate-600 sm:grid-cols-2">
                      <div className="flex min-w-0 items-start gap-2">
                        <Phone size={16} className="mt-0.5 shrink-0 text-slate-400" />
                        <span className="break-all">
                          {appointment.phone || "Phone unavailable"}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-start gap-2">
                        <CalendarDays size={16} className="mt-0.5 shrink-0 text-slate-400" />
                        <span className="break-words">
                          {formatDate(appointment.date)}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-start gap-2">
                        <Clock size={16} className="mt-0.5 shrink-0 text-slate-400" />
                        <span className="break-words">
                          {appointment.time || "Time unavailable"}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-start gap-2">
                        <UserRound size={16} className="mt-0.5 shrink-0 text-slate-400" />
                        <span className="break-words">
                          {appointment.reason || "General Consultation"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-5 flex min-w-0 flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                      <label
                        htmlFor={`status-${appointment.id}`}
                        className="text-sm font-semibold text-slate-600"
                      >
                        Update Status
                      </label>

                      <select
                        id={`status-${appointment.id}`}
                        value={appointment.status}
                        onChange={(event) =>
                          updateStatus(
                            appointment.id,
                            event.target.value as AppointmentStatus
                          )
                        }
                        className="min-h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-blue-500 sm:w-auto"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteAppointment(appointment.id)}
                      aria-label={`Delete appointment for ${appointment.patientName}`}
                      title="Delete appointment"
                      className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-red-100 px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 sm:w-auto"
                    >
                      <Trash2 size={17} />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* RESULTS COUNT */}
          {!loading && filteredAppointments.length > 0 && (
            <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
              Showing {filteredAppointments.length} of {appointments.length} appointments
            </p>
          )}
        </section>

        {/* FOOTER */}
        <footer className="py-6 text-center text-xs text-slate-400">
          © 2026 Swastik Clinic · Appointment Management
        </footer>
      </div>
    </main>
  );
}
