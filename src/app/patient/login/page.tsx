
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  UserRound,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { storage } from "@/lib/storage";

export default function PatientLoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const patients = storage.getPatients();

      const patient = patients.find(
        (item) => item.phone.replace(/\D/g, "") === cleanPhone
      );

      if (!patient) {
        setError(
          "No patient account found with this mobile number. Please book an appointment first."
        );
        return;
      }

      storage.loginPatient(patient);

      router.push("/patient/profile");
    } catch (error) {
      console.error("Patient login failed:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-4 py-10 sm:px-6">
      <section className="mx-auto flex min-h-[75vh] w-full max-w-md items-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          {/* ICON */}
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <UserRound size={30} />
          </div>

          {/* HEADER */}
          <div>
            <p className="text-sm font-bold text-blue-600">
              Noor Medicals
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Patient Login
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Login using your registered mobile number to view your profile,
              appointments and health updates.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Registered Mobile Number
              </label>

              <div className="relative">
                <Phone
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  placeholder="Enter 10-digit mobile number"
                  autoComplete="tel"
                  required
                  className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle size={19} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login to My Account"}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* SECURITY */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={15} className="text-emerald-600" />
            Your information stays associated with your patient account.
          </div>

          {/* BACK */}
          <Link
            href="/"
            className="mt-6 block text-center text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Noor Medicals
          </Link>
        </div>
      </section>
    </main>
  );
}
