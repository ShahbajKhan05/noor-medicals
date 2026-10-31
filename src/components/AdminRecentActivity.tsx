
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  FlaskConical,
  House,
  Clock,
  ArrowUpRight,
  Activity,
} from "lucide-react";

import { storage } from "@/lib/storage";
import type { Appointment, LabBooking } from "@/types";

type ActivityItem = {
  id: string;
  name: string;
  description: string;
  date: string;
  status: string;
  type: "appointment" | "lab" | "home";
  href: string;
};

export default function AdminRecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadActivities = useCallback(() => {
    try {
      const appointments = storage.getAppointments();
      const bookings = storage.getLabBookings();

      const appointmentActivities: ActivityItem[] = (
        appointments as Appointment[]
      ).map((item) => ({
        id: `appointment-${item.id}`,
        name: item.patientName,
        description: `Appointment · ${item.reason || "General consultation"}`,
        date: item.createdAt,
        status: item.status,
        type: "appointment",
        href: "/admin/appointments",
      }));

      const bookingActivities: ActivityItem[] = (
        bookings as LabBooking[]
      ).map((item) => {
        const isHomeCollection = Boolean(item.address?.trim());

        return {
          id: `booking-${item.id}`,
          name: item.patientName,
          description: isHomeCollection
            ? `Home Collection · ${item.testName}`
            : `Lab Booking · ${item.testName}`,
          date: item.createdAt,
          status: item.status,
          type: isHomeCollection ? "home" : "lab",
          href: isHomeCollection
            ? "/admin/home-collection"
            : "/admin/lab-tests",
        };
      });

      const combined = [
        ...appointmentActivities,
        ...bookingActivities,
      ];

      combined.sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();

        return (
          (Number.isFinite(timeB) ? timeB : 0) -
          (Number.isFinite(timeA) ? timeA : 0)
        );
      });

      setActivities(combined.slice(0, 8));
    } catch (error) {
      console.error("Unable to load recent activity:", error);
      setActivities([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadActivities();

    window.addEventListener("storage", loadActivities);
    window.addEventListener("focus", loadActivities);

    return () => {
      window.removeEventListener("storage", loadActivities);
      window.removeEventListener("focus", loadActivities);
    };
  }, [loadActivities]);

  function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700";
      case "completed":
        return "bg-blue-50 text-blue-700";
      case "cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-amber-50 text-amber-700";
    }
  }

  function getIcon(type: ActivityItem["type"]) {
    switch (type) {
      case "appointment":
        return CalendarDays;
      case "home":
        return House;
      default:
        return FlaskConical;
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div>
          <h3 className="font-extrabold text-slate-900">
            Recent Activity
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Latest appointments and booking requests
          </p>
        </div>

        <Activity className="text-emerald-500" size={22} />
      </div>

      {!loaded ? (
        <div className="p-8 text-center text-sm text-slate-400">
          Loading recent activity...
        </div>
      ) : activities.length === 0 ? (
        <div className="p-8 text-center">
          <Clock className="mx-auto mb-3 text-slate-300" size={35} />
          <p className="font-semibold text-slate-700">
            No recent activity
          </p>
          <p className="mt-1 text-sm text-slate-400">
            New appointments and bookings will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {activities.map((item) => {
            const Icon = getIcon(item.type);

            return (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 p-5 transition hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-800">
                      {item.name || "Unknown patient"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.description}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(item.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(item.status)}`}
                  >
                    {item.status || "pending"}
                  </span>

                  <Link
                    href={item.href}
                    aria-label={`View ${item.description}`}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
