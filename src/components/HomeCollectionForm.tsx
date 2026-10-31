
"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Clock, Home, MapPin } from "lucide-react";
import { storage } from "@/lib/storage";
import type { LabBooking } from "@/types";

export default function HomeCollectionForm() {
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [testName, setTestName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [today, setToday] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const localToday = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    setToday(localToday);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const booking: LabBooking = {
      id: crypto.randomUUID(),
      patientName: patientName.trim(),
      phone: phone.trim(),
      testName: testName.trim() || "Home Collection",
      date,
      time,
      address: address.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const existingBookings = storage.getLabBookings();
      storage.saveLabBookings([...existingBookings, booking]);

      setMessage("Home collection request submitted successfully!");

      setPatientName("");
      setPhone("");
      setAddress("");
      setTestName("");
      setDate("");
      setTime("");
    } catch {
      setMessage("Unable to save your request. Please try again.");
    }
  }

  return (
    <section className="glass-card mx-auto max-w-3xl p-5 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
          <Home size={25} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Book Home Collection
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Our collection team can collect your sample at home.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="home-patient-name" className="mb-2 block text-sm font-semibold text-slate-700">
            Patient Name *
          </label>
          <input
            id="home-patient-name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
            maxLength={80}
            autoComplete="name"
            placeholder="Enter patient name"
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label htmlFor="home-phone" className="mb-2 block text-sm font-semibold text-slate-700">
            Mobile Number *
          </label>
          <input
            id="home-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            pattern="[6-9][0-9]{9}"
            title="Enter a valid 10-digit Indian mobile number"
            maxLength={10}
            autoComplete="tel"
            placeholder="10-digit mobile number"
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label htmlFor="home-address" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <MapPin size={16} /> Complete Home Address *
          </label>
          <textarea
            id="home-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            maxLength={300}
            rows={3}
            autoComplete="street-address"
            placeholder="House number, street, area, landmark..."
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label htmlFor="home-test" className="mb-2 block text-sm font-semibold text-slate-700">
            Test / Package Name
          </label>
          <input
            id="home-test"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            maxLength={120}
            placeholder="Enter test name (optional)"
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="home-date" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <CalendarDays size={16} /> Preferred Date *
            </label>
            <input
              id="home-date"
              type="date"
              min={today || undefined}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={!today}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="home-time" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Clock size={16} /> Preferred Time *
            </label>
            <input
              id="home-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!today}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Home size={19} />
          Submit Home Collection Request
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
    </section>
  );
}
