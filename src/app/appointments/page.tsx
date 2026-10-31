"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  User,
  Phone,
} from "lucide-react";

import { storage } from "@/lib/storage";
import type { Appointment, Patient } from "@/types";

export default function PatientAppointmentsPage() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const currentPatient = storage.getCurrentPatient();

      setPatient(currentPatient);

      if (currentPatient) {
        const allAppointments = storage.getAppointments();

        // ✅ FIXED: Removed patientId to match Appointment type
        const patientAppointments = allAppointments.filter(
          (appointment) =>
            appointment.phone === currentPatient.phone ||
            appointment.patientName === currentPatient.name
        );

        setAppointments(patientAppointments);
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-slate-600">
            Loading appointments...
          </p>
        </div>
      </main>
    );
  }

  if (!patient) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <User size={50} className="mx-auto mb-4 text-blue-600" />

          <h1 className="text-2xl font-bold text-slate-900">
            Patient Not Logged In
          </h1>

          <p className="mt-3 text-slate-500">
            Please login first to view your appointments.
          </p>

          <Link
            href="/patient/login"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Patient Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-6">
          <Link
            href="/patient/profile"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={18} />
            Back to Profile
          </Link>

          <h1 className="text-3xl font-bold text-slate-900">
            My Appointments
          </h1>

          <p className="mt-2 text-slate-500">
            View and manage your appointment requests.
          </p>
        </div>

        {/* PATIENT INFO */}
        <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <User size={28} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {patient.name}
              </h2>

              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <Phone size={15} />
                {patient.phone}
              </p>
            </div>
          </div>
        </section>

        {/* APPOINTMENTS */}
        {appointments.length === 0 ? (
          <section className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <CalendarDays
              size={50}
              className="mx-auto mb-4 text-slate-300"
            />

            <h2 className="text-xl font-bold text-slate-900">
              No Appointments Yet
            </h2>

            <p className="mt-2 text-slate-500">
              You haven't booked any appointments yet.
            </p>

            <Link
              href="/appointments"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Book Appointment
            </Link>
          </section>
        ) : (
          <section className="space-y-4">
            {appointments.map((appointment) => (
              <article
                key={appointment.id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Appointment Request
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      {appointment.reason || "General Consultation"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        {appointment.date}
                      </span>

                      <span className="flex items-center gap-2">
                        <Clock size={16} />
                        {appointment.time}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-block rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : appointment.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {appointment.status || "pending"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}