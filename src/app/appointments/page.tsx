
import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ShieldCheck, Clock, ArrowLeft } from "lucide-react";
import AppointmentForm from "../../components/AppointmentForm";

export const metadata: Metadata = {
  title: "Book Doctor Appointment in Rewa | Swastik Clinic",
  description:
    "Book a doctor appointment at Swastik Clinic, Rewa, Madhya Pradesh. Submit your appointment request online quickly and conveniently.",
  alternates: {
    canonical: "/appointments",
  },
  openGraph: {
    title: "Book Doctor Appointment | Swastik Clinic Rewa",
    description:
      "Request your doctor appointment online at Swastik Clinic, Rewa.",
    type: "website",
    siteName: "Swastik Clinic",
  },
};

export default function AppointmentsPage() {
  return (
    <main className="min-h-screen px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl">

        <Link
          href="/"
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <header className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <CalendarDays size={28} />
          </div>

          <p className="text-xs font-bold tracking-widest text-blue-600">
            SWASTIK CLINIC · REWA
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Book Your Appointment
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Fill in your details to request a doctor appointment.
            Our clinic team can confirm your booking.
          </p>
        </header>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="glass-card flex items-center gap-3 p-3 sm:p-4">
            <ShieldCheck className="shrink-0 text-emerald-600" size={23} />
            <span className="text-xs font-semibold text-slate-700 sm:text-sm">
              Simple Booking
            </span>
          </div>

          <div className="glass-card flex items-center gap-3 p-3 sm:p-4">
            <Clock className="shrink-0 text-blue-600" size={23} />
            <span className="text-xs font-semibold text-slate-700 sm:text-sm">
              Appointment Request
            </span>
          </div>
        </div>

        <section className="glass-card p-4 sm:p-8">
          <AppointmentForm />
        </section>

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          Submitting this form creates a demo booking request in this browser.
          It does not confirm a medical appointment.
        </p>

      </div>
    </main>
  );
}
