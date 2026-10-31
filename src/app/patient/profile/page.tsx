"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock, User, Phone, Bell } from "lucide-react";

import { storage } from "@/lib/storage";
import type { Appointment, Patient, AppNotification } from "@/types";

export default function PatientProfilePage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedPatients = storage.getPatients();
      const savedAppointments = storage.getAppointments();

      setPatients(savedPatients);
      setAppointments(savedAppointments);

      // Notifications agar storage me available hain
      if (typeof storage.getNotifications === "function") {
        setNotifications(storage.getNotifications());
      }
    } catch (error) {
      console.error("Error loading patient profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-slate-500">Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* HEADER */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <User size={30} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Patient Profile</h1>
              <p className="mt-1 text-sm text-blue-100">
                View your registered details and appointments
              </p>
            </div>
          </div>
        </div>

        {/* PATIENT DETAILS */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <User className="text-blue-600" size={22} />
            <h2 className="text-xl font-bold text-slate-900">
              Registered Patients
            </h2>
          </div>

          {patients.length === 0 ? (
            <p className="text-slate-500">
              No patient information found. Please book an appointment first.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="rounded-xl border border-slate-200 p-5"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    {patient.name}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <Phone size={16} className="text-blue-600" />
                      {patient.phone}
                    </p>

                    <p>
                      <span className="font-semibold">Age:</span> {patient.age}
                    </p>

                    <p>
                      <span className="font-semibold">Gender:</span>{" "}
                      {patient.gender}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* APPOINTMENTS */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <CalendarDays className="text-blue-600" size={22} />
            <h2 className="text-xl font-bold text-slate-900">
              My Appointments
            </h2>
          </div>

          {appointments.length === 0 ? (
            <p className="text-slate-500">
              No appointments found.
            </p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {appointment.patientName}
                      </h3>

                      {appointment.reason && (
                        <p className="mt-2 text-sm text-slate-600">
                          {appointment.reason}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-blue-600" />
                        {appointment.date}
                      </p>

                      <p className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-600" />
                        {appointment.time}
                      </p>

                      <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold capitalize text-yellow-700">
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* NOTIFICATIONS */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Bell className="text-blue-600" size={22} />
            <h2 className="text-xl font-bold text-slate-900">
              Notifications
            </h2>
          </div>

          {notifications.length === 0 ? (
            <p className="text-slate-500">
              No notifications yet.
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-xl border p-4 ${
                    notification.isRead
                      ? "border-slate-200 bg-slate-50"
                      : "border-blue-200 bg-blue-50"
                  }`}
                >
                  <h3 className="font-semibold text-slate-900">
                    {notification.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}