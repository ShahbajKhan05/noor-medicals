
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FlaskConical, ShieldCheck, Microscope } from "lucide-react";
import LabTestCatalog from "../../components/LabTestCatalog";

export const metadata: Metadata = {
  title: "Pathology Lab Tests & Prices in Rewa | Swastik Clinic",
  description:
    "Explore pathology and diagnostic tests at Swastik Clinic, Rewa. Browse available lab tests and submit a test booking request online.",
  alternates: {
    canonical: "/lab-tests",
  },
  openGraph: {
    title: "Pathology Lab Tests | Swastik Clinic Rewa",
    description:
      "Explore diagnostic tests and request lab test bookings at Swastik Clinic, Rewa.",
    type: "website",
    siteName: "Swastik Clinic",
  },
};

export default function LabTestsPage() {
  return (
    <main className="min-h-screen px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">

        <Link
          href="/"
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
            <FlaskConical size={28} />
          </div>

          <p className="text-xs font-bold tracking-widest text-cyan-700">
            SWASTIK CLINIC · REWA
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Pathology & Lab Tests
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Explore available diagnostic tests and submit your booking request
            through Swastik Clinic.
          </p>
        </header>

        <div className="mb-7 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="glass-card flex items-center gap-3 p-4">
            <ShieldCheck size={23} className="shrink-0 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-700 sm:text-sm">
              Easy Booking
            </span>
          </div>

          <div className="glass-card flex items-center gap-3 p-4">
            <Microscope size={23} className="shrink-0 text-cyan-600" />
            <span className="text-xs font-semibold text-slate-700 sm:text-sm">
              Diagnostic Services
            </span>
          </div>
        </div>

        <section aria-label="Available laboratory tests">
          <LabTestCatalog />
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          Test availability, pricing and booking confirmation must be verified
          by the clinic.
        </p>
      </div>
    </main>
  );
}
