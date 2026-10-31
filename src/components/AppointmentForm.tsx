"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import type {
  Appointment,
  Patient,
  AppNotification,
} from "@/types";
import {
  CalendarDays,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function AppointmentForm() {
  const [form, setForm] = useState({
    patientName: "",
    phone: "",
    age: "",
    gender: "",
    date: "",
    time: "",
    reason: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error"
  >("success");

  const [today, setToday] = useState("");

  useEffect(() => {
    const currentDate = new Date();

    const localDate = [
      currentDate.getFullYear(),
      String(currentDate.getMonth() + 1).padStart(2, "0"),
      String(currentDate.getDate()).padStart(2, "0"),
    ].join("-");

    setToday(localDate);
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  }

  function showMessage(
    text: string,
    type: "success" | "error"
  ) {
    setMessage(text);
    setMessageType(type);
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!today || form.date < today) {
      showMessage(
        "Please select a valid appointment date.",
        "error"
      );
      return;
    }

    const phone = form.phone.replace(/\D/g, "");

    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      showMessage(
        "Please enter a valid 10-digit mobile number.",
        "error"
      );
      return;
    }

    try {
      /* =========================
         GET OR CREATE PATIENT
      ========================= */

      const existingPatients = storage.getPatients();

      let patient = existingPatients.find(
        (item) => item.phone === phone
      );

      if (!patient) {
        patient = {
          id: crypto.randomUUID(),
          name: form.patientName.trim(),
          phone,
          age: Number(form.age),
          gender: form.gender as
            | "Male"
            | "Female"
            | "Other",
          createdAt: new Date().toISOString(),
        };

        storage.savePatients([
          ...existingPatients,
          patient,
        ]);
      } else {
        const updatedPatient: Patient = {
          ...patient,
          name: form.patientName.trim(),
          age: Number(form.age),
          gender: form.gender as
            | "Male"
            | "Female"
            | "Other",
        };

        const updatedPatients = existingPatients.map(
          (item) =>
            item.id === updatedPatient.id
              ? updatedPatient
              : item
        );

        storage.savePatients(updatedPatients);

        patient = updatedPatient;
      }

      /* =========================
         CREATE APPOINTMENT
      ========================= */

      const appointment: Appointment = {
        id: crypto.randomUUID(),
        patientId: patient.id,          // 👈 YEH LINE ADD KAREIN
        patientName: patient.name,
        phone: patient.phone,
        date: form.date,
        time: form.time,
        reason: form.reason.trim(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const existingAppointments =
        storage.getAppointments();

      storage.saveAppointments([
        ...existingAppointments,
        appointment,
      ]);

      /* =========================
         CREATE NOTIFICATION
      ========================= */

      const notification: AppNotification = {
        id: crypto.randomUUID(),
        patientId: patient.id,
        phone: patient.phone,

        title: "Appointment Requested",

        message: `Your appointment request for ${form.date} at ${form.time} has been submitted successfully.`,

        type: "appointment",

        isRead: false,

        createdAt: new Date().toISOString(),

        link: "/patient/profile",
      };

      storage.addNotification(notification);

      /* =========================
         SUCCESS
      ========================= */

      showMessage(
        "Appointment request submitted successfully!",
        "success"
      );

      setForm({
        patientName: "",
        phone: "",
        age: "",
        gender: "",
        date: "",
        time: "",
        reason: "",
      });
    } catch (error) {
      console.error("Appointment booking error:", error);

      showMessage(
        "Unable to save your appointment. Please try again.",
        "error"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Patient Details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter your details to request an appointment.
        </p>
      </div>

      {/* NAME */}

      <div>
        <label
          htmlFor="patientName"
          className="mb-2 block text-sm font-semibold"
        >
          Full Name *
        </label>

        <input
          id="patientName"
          name="patientName"
          value={form.patientName}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
          maxLength={80}
          autoComplete="name"
          className="w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {/* PHONE + AGE */}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold"
          >
            Mobile Number *
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            pattern="[6-9][0-9]{9}"
            maxLength={10}
            required
            autoComplete="tel"
            className="w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="age"
            className="mb-2 block text-sm font-semibold"
          >
            Age *
          </label>

          <input
            id="age"
            name="age"
            type="number"
            min="1"
            max="120"
            value={form.age}
            onChange={handleChange}
            placeholder="Your age"
            required
            className="w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* GENDER */}

      <div>
        <label
          htmlFor="gender"
          className="mb-2 block text-sm font-semibold"
        >
          Gender *
        </label>

        <select
          id="gender"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* APPOINTMENT */}

      <div className="border-t border-slate-200 pt-5">
        <h2 className="text-xl font-bold text-slate-900">
          Appointment Details
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="date"
            className="mb-2 block text-sm font-semibold"
          >
            Preferred Date *
          </label>

          <input
            id="date"
            name="date"
            type="date"
            min={today}
            value={form.date}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="time"
            className="mb-2 block text-sm font-semibold"
          >
            Preferred Time *
          </label>

          <select
            id="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Select time</option>
            <option value="09:00 AM">09:00 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="04:00 PM">04:00 PM</option>
            <option value="05:00 PM">05:00 PM</option>
            <option value="06:00 PM">06:00 PM</option>
          </select>
        </div>
      </div>

      {/* REASON */}

      <div>
        <label
          htmlFor="reason"
          className="mb-2 block text-sm font-semibold"
        >
          Reason for Visit
        </label>

        <textarea
          id="reason"
          name="reason"
          rows={3}
          maxLength={500}
          value={form.reason}
          onChange={handleChange}
          placeholder="Briefly describe your reason for visiting"
          className="w-full resize-y rounded-xl border border-slate-200 bg-white/80 p-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {/* SUBMIT */}

      <button
        type="submit"
        disabled={!today}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CalendarDays size={19} />
        Request Appointment
      </button>

      {/* MESSAGE */}

      {message && (
        <div
          role="status"
          aria-live="polite"
          className={`flex items-center gap-2 rounded-xl p-4 text-sm font-semibold ${
            messageType === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {messageType === "success" ? (
            <CheckCircle2 size={19} />
          ) : (
            <AlertCircle size={19} />
          )}

          {message}
        </div>
      )}
    </form>
  );
}