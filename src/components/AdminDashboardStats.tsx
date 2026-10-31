
"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CalendarDays,
  FlaskConical,
  House,
} from "lucide-react";
import { storage } from "@/lib/storage";
import type { LabBooking } from "@/types";

type DashboardStats = {
  patients: number;
  appointments: number;
  labBookings: number;
  homeCollections: number;
};

const initialStats: DashboardStats = {
  patients: 0,
  appointments: 0,
  labBookings: 0,
  homeCollections: 0,
};

export default function AdminDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function loadStats() {
      try {
        const patients = storage.getPatients();
        const appointments = storage.getAppointments();
        const labBookings = storage.getLabBookings() as LabBooking[];

        const homeCollections = labBookings.filter((booking) =>
          Boolean(booking.address?.trim())
        );

        const regularLabBookings = labBookings.filter(
          (booking) => !booking.address?.trim()
        );

        setStats({
          patients: patients.length,
          appointments: appointments.length,
          labBookings: regularLabBookings.length,
          homeCollections: homeCollections.length,
        });
      } catch (error) {
        console.error("Unable to load dashboard statistics:", error);
        setStats(initialStats);
      } finally {
        setLoaded(true);
      }
    }

    loadStats();

    // Update when LocalStorage changes in another browser tab.
    window.addEventListener("storage", loadStats);

    // Refresh when the admin returns to this browser tab.
    window.addEventListener("focus", loadStats);

    return () => {
      window.removeEventListener("storage", loadStats);
      window.removeEventListener("focus", loadStats);
    };
  }, []);

  const statCards = [
    {
      label: "Total Patients",
      value: stats.patients,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      description: "Registered patient records",
    },
    {
      label: "Appointments",
      value: stats.appointments,
      icon: CalendarDays,
      color: "bg-violet-50 text-violet-600",
      description: "Total appointment bookings",
    },
    {
      label: "Lab Bookings",
      value: stats.labBookings,
      icon: FlaskConical,
      color: "bg-cyan-50 text-cyan-600",
      description: "Regular lab test requests",
    },
    {
      label: "Home Collection",
      value: stats.homeCollections,
      icon: House,
      color: "bg-emerald-50 text-emerald-600",
      description: "Home sample collection requests",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                {stat.label}
              </span>

              <span className={`rounded-xl p-3 ${stat.color}`}>
                <Icon size={21} />
              </span>
            </div>

            <p className="mt-4 text-3xl font-extrabold text-slate-900">
              {loaded ? stat.value : "—"}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
