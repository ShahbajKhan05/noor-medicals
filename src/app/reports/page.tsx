
import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowRight, ShieldCheck, ClipboardList } from "lucide-react";
import ReportsDashboard from "../../components/ReportsDashboard";

export const metadata: Metadata = {
  title: "Patient Reports | Swastik Clinic Rewa",
  description:
    "Access and manage pathology test reports from Swastik Clinic, Rewa.",
  alternates: {
    canonical: "/reports",
  },
};

export default function ReportsPage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            <ArrowRight className="rotate-180" size={16} />
            Back to Home
          </Link>

          <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-cyan-600 p-7 text-white shadow-xl sm:p-10">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <FileText size={30} />
            </div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Patient Reports
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-50 sm:text-base">
              View your available pathology reports and access report documents
              provided by Swastik Clinic, Rewa.
            </p>
          </div>
        </div>

        <div className="mb-7 grid gap-4 sm:grid-cols-2">
          <div className="glass-card flex items-center gap-4 p-5">
            <ClipboardList className="text-blue-600" size={28} />
            <div>
              <h2 className="font-bold text-slate-900">Your Reports</h2>
              <p className="text-sm text-slate-500">
                Reports saved in this browser
              </p>
            </div>
          </div>

          <div className="glass-card flex items-center gap-4 p-5">
            <ShieldCheck className="text-emerald-600" size={28} />
            <div>
              <h2 className="font-bold text-slate-900">Report Access</h2>
              <p className="text-sm text-slate-500">
                Use the report link provided by the clinic
              </p>
            </div>
          </div>
        </div>

        <ReportsDashboard />
      </div>
    </main>
  );
}
