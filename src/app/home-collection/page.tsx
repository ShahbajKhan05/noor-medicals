
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  House,
  MapPin,
  ShieldCheck,
  Clock,
} from "lucide-react";
import HomeCollectionForm from "../../components/HomeCollectionForm";

export const metadata: Metadata = {
  title: "Home Sample Collection in Rewa | Swastik Clinic",
  description:
    "Request home sample collection in Rewa, Madhya Pradesh through Swastik Clinic. Submit your contact details and preferred collection time online.",
  alternates: {
    canonical: "/home-collection",
  },
  openGraph: {
    title: "Home Sample Collection | Swastik Clinic Rewa",
    description:
      "Request a convenient home sample collection from Swastik Clinic in Rewa.",
    type: "website",
    siteName: "Swastik Clinic",
  },
};

export default function HomeCollectionPage() {
  return (
    <main className="min-h-screen px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl">

        <Link
          href="/"
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-800"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <House size={28} />
          </div>

          <p className="text-xs font-bold tracking-widest text-emerald-700">
            SWASTIK CLINIC · REWA
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Home Sample Collection
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Request a home sample collection by submitting your details
            and preferred date.
          </p>
        </header>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="glass-card flex items-center gap-3 p-4">
            <MapPin size={22} className="shrink-0 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-700 sm:text-sm">
              Rewa Location
            </span>
          </div>

          <div className="glass-card flex items-center gap-3 p-4">
            <ShieldCheck size={22} className="shrink-0 text-blue-600" />
            <span className="text-xs font-semibold text-slate-700 sm:text-sm">
              Easy Request
            </span>
          </div>
        </div>

        <section className="glass-card p-4 sm:p-8">
          <HomeCollectionForm />
        </section>

        <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <Clock size={15} />
          Collection timing and availability require clinic confirmation.
        </p>

      </div>
    </main>
  );
}
