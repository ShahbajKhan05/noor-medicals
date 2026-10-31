
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  CalendarDays,
  MessageCircle,
  Save,
  CheckCircle2,
} from "lucide-react";

type ClinicSettings = {
  clinicName: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingTime: string;
  closingTime: string;
  workingDays: string[];
  description: string;
  appointmentEnabled: boolean;
  homeCollectionEnabled: boolean;
};

const STORAGE_KEY = "swastik_clinic_settings";

const defaultSettings: ClinicSettings = {
  clinicName: "Swastik Clinic",
  address: "Rewa, Madhya Pradesh, India",
  phone: "",
  whatsapp: "",
  email: "",
  openingTime: "09:00",
  closingTime: "21:00",
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  description: "Your trusted healthcare partner in Rewa.",
  appointmentEnabled: true,
  homeCollectionEnabled: true,
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<ClinicSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({
          ...defaultSettings,
          ...parsed,
        });
      }
    } catch (error) {
      console.error("Settings load error:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  function updateField<K extends keyof ClinicSettings>(
    field: K,
    value: ClinicSettings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
    setSaved(false);
  }

  function toggleDay(day: string) {
    const updated = settings.workingDays.includes(day)
      ? settings.workingDays.filter((item) => item !== day)
      : [...settings.workingDays, day];

    updateField("workingDays", updated);
  }

  function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSaved(true);
    } catch (error) {
      console.error("Settings save error:", error);
      alert("Settings save nahi ho paayi.");
    }
  }

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading clinic settings...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-7">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-7">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <Settings size={28} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Clinic Settings
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage clinic information, timings and booking preferences.
          </p>
        </div>

        <form onSubmit={saveSettings} className="space-y-6">
          {/* CLINIC INFORMATION */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <Building2 className="text-blue-600" size={23} />
              <h2 className="text-lg font-extrabold text-slate-900">
                Clinic Information
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="clinicName" className="mb-2 block text-sm font-semibold text-slate-700">
                  Clinic Name
                </label>
                <input
                  id="clinicName"
                  required
                  value={settings.clinicName}
                  onChange={(event) => updateField("clinicName", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">
                  Clinic Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={settings.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="address" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPin size={16} />
                  Full Address
                </label>
                <textarea
                  id="address"
                  rows={2}
                  required
                  value={settings.address}
                  onChange={(event) => updateField("address", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          {/* CONTACT DETAILS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <Phone className="text-blue-600" size={23} />
              <h2 className="text-lg font-extrabold text-slate-900">
                Contact Details
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">
                  Clinic Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={settings.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="Enter phone number"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MessageCircle size={16} />
                  WhatsApp Number
                </label>
                <input
                  id="whatsapp"
                  type="tel"
                  value={settings.whatsapp}
                  onChange={(event) => updateField("whatsapp", event.target.value)}
                  placeholder="Enter WhatsApp number"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="clinic@example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          {/* CLINIC TIMINGS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <Clock className="text-blue-600" size={23} />
              <h2 className="text-lg font-extrabold text-slate-900">
                Clinic Timings
              </h2>
            </div>

            <div className="mb-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="openingTime" className="mb-2 block text-sm font-semibold text-slate-700">
                  Opening Time
                </label>
                <input
                  id="openingTime"
                  type="time"
                  required
                  value={settings.openingTime}
                  onChange={(event) => updateField("openingTime", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="closingTime" className="mb-2 block text-sm font-semibold text-slate-700">
                  Closing Time
                </label>
                <input
                  id="closingTime"
                  type="time"
                  required
                  value={settings.closingTime}
                  onChange={(event) => updateField("closingTime", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Working Days
            </h3>

            <div className="flex flex-wrap gap-2">
              {days.map((day) => {
                const active = settings.workingDays.includes(day);

                return (
                  <button
                    key={day}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleDay(day)}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </section>

          {/* BOOKING PREFERENCES */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <CalendarDays className="text-blue-600" size={23} />
              <h2 className="text-lg font-extrabold text-slate-900">
                Booking Preferences
              </h2>
            </div>

            <div className="space-y-4">
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
                <span>
                  <span className="block font-semibold text-slate-800">
                    Doctor Appointments
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    Enable or disable appointment requests.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.appointmentEnabled}
                  onChange={(event) => updateField("appointmentEnabled", event.target.checked)}
                  className="h-5 w-5 accent-blue-600"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
                <span>
                  <span className="block font-semibold text-slate-800">
                    Home Sample Collection
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    Enable or disable home collection requests.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.homeCollectionEnabled}
                  onChange={(event) => updateField("homeCollectionEnabled", event.target.checked)}
                  className="h-5 w-5 accent-blue-600"
                />
              </label>
            </div>
          </section>

          {/* SAVE */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {saved && (
              <p role="status" className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <CheckCircle2 size={18} />
                Settings saved successfully.
              </p>
            )}

            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:ml-auto"
            >
              <Save size={18} />
              Save Clinic Settings
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Settings are currently saved in this browser only.
        </p>
      </div>
    </main>
  );
}
