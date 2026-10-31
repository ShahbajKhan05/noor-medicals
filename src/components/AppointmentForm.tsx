
"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import type { Appointment } from "@/types";
import { CalendarDays, CheckCircle2 } from "lucide-react";

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
  const [today, setToday] = useState("");

  // Calculate local date after component mounts
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
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!today || form.date < today) {
      setMessage("Please select a valid appointment date.");
      return;
    }

    const appointment: Appointment = {
      id: crypto.randomUUID(),
      patientName: form.patientName.trim(),
      phone: form.phone.trim(),
      date: form.date,
      time: form.time,
      reason: `Age: ${form.age}, Gender: ${form.gender}. ${form.reason.trim()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = storage.getAppointments();
      storage.saveAppointments([...existing, appointment]);

      setMessage("Appointment request saved successfully!");

      setForm({
        patientName: "",
        phone: "",
        age: "",
        gender: "",
        date: "",
        time: "",
        reason: "",
      });
    } catch {
      setMessage("Unable to save booking. Please try again.");
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

      <div>
        <label htmlFor="patientName" className="mb-2 block text-sm font-semibold">
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-semibold">
            Mobile Number *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            pattern="[6-9][0-9]{9}"
            title="Enter a valid 10-digit Indian mobile number"
            required
            autoComplete="tel"
            className="w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="age" className="mb-2 block text-sm font-semibold">
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

      <div>
        <label htmlFor="gender" className="mb-2 block text-sm font-semibold">
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

      <div className="border-t border-slate-200 pt-5">
        <h2 className="text-xl font-bold text-slate-900">
          Appointment Details
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="mb-2 block text-sm font-semibold">
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
          <label htmlFor="time" className="mb-2 block text-sm font-semibold">
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

      <div>
        <label htmlFor="reason" className="mb-2 block text-sm font-semibold">
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

      <button
        type="submit"
        disabled={!today}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CalendarDays size={19} />
        Request Appointment
      </button>

      {message && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700"
        >
          <CheckCircle2 size={19} />
          {message}
        </div>
      )}
    </form>
  );
}
