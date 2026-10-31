
"use client";

import { useEffect, useState } from "react";
import { Search, FileText, Download, ExternalLink } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { storage } from "@/lib/storage";
import type { HealthReport } from "@/types";

export default function ReportsDashboard() {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setReports(storage.getReports());
    } catch (error) {
      console.error("Unable to load reports:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredReports = reports.filter((report) => {
    const query = search.toLowerCase();

    return (
      report.patientName.toLowerCase().includes(query) ||
      report.reportName.toLowerCase().includes(query)
    );
  });

  return (
    <GlassCard className="p-5 sm:p-7">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Available Reports
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Search reports saved in this browser.
        </p>
      </div>

      <div className="relative mb-6">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by patient or report name..."
          aria-label="Search patient reports"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {loading ? (
        <p className="py-10 text-center text-slate-500">
          Loading reports...
        </p>
      ) : filteredReports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center">
          <FileText className="mx-auto mb-3 text-slate-400" size={38} />
          <h3 className="font-bold text-slate-700">
            {search ? "No matching reports found" : "No reports available"}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {search
              ? "Try searching with another name."
              : "Reports will appear here when they are added."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white/70 p-4 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText size={22} />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-bold text-slate-800">
                    {report.reportName}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {report.patientName}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {report.date}
                  </p>
                </div>
              </div>

              {report.reportUrl ? (
                <div className="flex shrink-0 gap-2">
                  <a
                    href={report.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <ExternalLink size={16} />
                    Open
                  </a>

                  <a
                    href={report.reportUrl}
                    download
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    aria-label={`Download ${report.reportName}`}
                  >
                    <Download size={16} />
                  </a>
                </div>
              ) : (
                <span className="text-sm text-amber-600">
                  Report link unavailable
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
