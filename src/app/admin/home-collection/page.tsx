
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  Search,
  RefreshCw,
  Trash2,
  User,
  House,
  ClipboardList,
} from "lucide-react";

import { storage } from "@/lib/storage";
import type { LabBooking, AppointmentStatus } from "@/types";

const statusOptions: AppointmentStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

export default function AdminHomeCollectionPage() {
  const [bookings, setBookings] = useState<LabBooking[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [ready, setReady] = useState(false);

  const refreshBookings = useCallback(() => {
    const allBookings = storage.getLabBookings();

    setBookings(
      allBookings.filter((booking) => Boolean(booking.address?.trim()))
    );
  }, []);

  useEffect(() => {
    refreshBookings();
    setReady(true);

    const handleStorage = () => refreshBookings();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleStorage);
    window.addEventListener("lab-tests-updated", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleStorage);
      window.removeEventListener("lab-tests-updated", handleStorage);
    };
  }, [refreshBookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        booking.patientName.toLowerCase().includes(query) ||
        booking.phone.includes(query) ||
        booking.address.toLowerCase().includes(query) ||
        (booking.testName || "").toLowerCase().includes(query);

      const matchesStatus =
        filter === "all" || booking.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, filter]);

  const counts = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    }),
    [bookings]
  );

  function updateStatus(id: string, status: AppointmentStatus) {
    const allBookings = storage.getLabBookings();

    const updated = allBookings.map((booking) =>
      booking.id === id ? { ...booking, status } : booking
    );

    storage.saveLabBookings(updated);
    refreshBookings();
  }

  function deleteBooking(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this home collection booking?"
    );

    if (!confirmed) return;

    const updated = storage
      .getLabBookings()
      .filter((booking) => booking.id !== id);

    storage.saveLabBookings(updated);
    refreshBookings();
  }

  const statusStyle: Record<AppointmentStatus, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statCards = [
    {
      label: "Total Bookings",
      value: counts.total,
      color: "text-slate-900",
      icon: ClipboardList,
      iconColor: "bg-slate-100 text-slate-700",
    },
    {
      label: "Pending",
      value: counts.pending,
      color: "text-amber-600",
      icon: Clock,
      iconColor: "bg-amber-50 text-amber-600",
    },
    {
      label: "Confirmed",
      value: counts.confirmed,
      color: "text-blue-600",
      icon: CalendarDays,
      iconColor: "bg-blue-50 text-blue-600",
    },
    {
      label: "Completed",
      value: counts.completed,
      color: "text-emerald-600",
      icon: House,
      iconColor: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Cancelled",
      value: counts.cancelled,
      color: "text-red-600",
      icon: Trash2,
      iconColor: "bg-red-50 text-red-600",
    },
  ];

  return (
    <main className="mx-auto w-full min-w-0 max-w-[1600px] space-y-5 overflow-x-hidden p-3 sm:space-y-6 sm:p-4 lg:p-6">

      {/* HEADER */}
      <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="shrink-0 rounded-xl bg-emerald-100 p-3 text-emerald-700">
            <House size={25} />
          </div>

          <div className="min-w-0">
            <h1 className="break-words text-xl font-extrabold text-slate-900 sm:text-2xl lg:text-3xl">
              Home Collection
            </h1>
            <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
              Manage patient home sample collection requests.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={refreshBookings}
          className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
        >
          <RefreshCw size={17} />
          Refresh Bookings
        </button>
      </header>

      {/* STATISTICS */}
      <section
        aria-label="Booking statistics"
        className="grid min-w-0 grid-cols-1 gap-3 min-[400px]:grid-cols-2 xl:grid-cols-5"
      >
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="min-w-0">
                <p className="break-words text-sm font-medium text-slate-500">
                  {item.label}
                </p>

                <p
                  className={`mt-2 text-2xl font-extrabold tabular-nums sm:text-3xl ${item.color}`}
                >
                  {item.value}
                </p>
              </div>

              <div className={`shrink-0 rounded-xl p-3 ${item.iconColor}`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </section>

      {/* SEARCH AND FILTER */}
      <section className="flex w-full min-w-0 flex-col gap-3 md:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient, phone, address or test..."
            aria-label="Search home collection bookings"
            className="min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter bookings by status"
          className="min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 md:w-52"
        >
          <option value="all">All Status</option>

          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </section>

      {/* BOOKINGS */}
      <section className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Collection Requests
          </h2>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 sm:text-sm">
            {filteredBookings.length} Records
          </span>
        </div>

        {!ready ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Loading bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center sm:px-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <House size={30} />
            </div>

            <h3 className="text-base font-bold text-slate-800 sm:text-lg">
              No home collection bookings found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              New requests submitted through the website will appear here.
            </p>
          </div>
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-4 2xl:grid-cols-2">
            {filteredBookings.map((booking) => (
              <article
                key={booking.id}
                className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
              >
                {/* PATIENT HEADER */}
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="shrink-0 rounded-xl bg-blue-50 p-2.5 text-blue-600">
                      <User size={21} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="break-words text-base font-bold text-slate-900 sm:text-lg">
                        {booking.patientName}
                      </h3>

                      <p className="mt-1 break-all text-xs text-slate-400">
                        ID: {booking.id}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyle[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* BOOKING DETAILS */}
                <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <Phone
                      size={17}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">Mobile Number</p>
                      <p className="break-all text-sm font-semibold text-slate-700">
                        {booking.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-start gap-2.5">
                    <ClipboardList
                      size={17}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">Required Test</p>
                      <p className="break-words text-sm font-semibold text-slate-700">
                        {booking.testName || "Home Collection"}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-start gap-2.5">
                    <CalendarDays
                      size={17}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">Collection Date</p>
                      <p className="break-words text-sm font-semibold text-slate-700">
                        {booking.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-start gap-2.5">
                    <Clock
                      size={17}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">Preferred Time</p>
                      <p className="break-words text-sm font-semibold text-slate-700">
                        {booking.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-start gap-2.5 sm:col-span-2">
                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">
                        Collection Address
                      </p>
                      <p className="break-words text-sm leading-6 text-slate-700">
                        {booking.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-5 flex min-w-0 flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                    <label
                      htmlFor={`status-${booking.id}`}
                      className="shrink-0 text-sm font-semibold text-slate-600"
                    >
                      Update Status
                    </label>

                    <select
                      id={`status-${booking.id}`}
                      value={booking.status}
                      onChange={(e) =>
                        updateStatus(
                          booking.id,
                          e.target.value as AppointmentStatus
                        )
                      }
                      className="min-h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold capitalize outline-none focus:border-blue-500 sm:w-auto"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteBooking(booking.id)}
                    className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 sm:w-auto"
                  >
                    <Trash2 size={16} />
                    Delete Booking
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
