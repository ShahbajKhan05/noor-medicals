
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  Download,
  Upload,
  Link as LinkIcon,
} from "lucide-react";
import { storage } from "@/lib/storage";
import type { HealthReport } from "@/types";

type ReportForm = {
  patientName: string;
  reportName: string;
  date: string;
  reportUrl: string;
};

const emptyForm: ReportForm = {
  patientName: "",
  reportName: "",
  date: "",
  reportUrl: "",
};

const MAX_PDF_SIZE = 1024 * 1024; // 1 MB

export default function AdminReportsManager() {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<ReportForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sourceType, setSourceType] = useState<"upload" | "link">("upload");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setReports(storage.getReports());
    } catch (err) {
      console.error("Unable to load reports:", err);
      setError("Reports load nahi ho paayi.");
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reports.filter(
      (report) =>
        report.patientName.toLowerCase().includes(query) ||
        report.reportName.toLowerCase().includes(query)
    );
  }, [reports, search]);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setSourceType("upload");
    setFileName("");
    setError("");
    setModalOpen(true);
  }

  function openEditForm(report: HealthReport) {
    setEditingId(report.id);

    const isUploadedFile = report.reportUrl.startsWith("data:application/pdf");

    setSourceType(isUploadedFile ? "upload" : "link");
    setFileName(isUploadedFile ? "Previously uploaded PDF" : "");

    setForm({
      patientName: report.patientName,
      reportName: report.reportName,
      date: report.date,
      reportUrl: report.reportUrl,
    });

    setError("");
    setModalOpen(true);
  }

  function handlePdfUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (file.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PDF_SIZE) {
      setError("PDF size 1 MB se kam honi chahiye.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((current) => ({
          ...current,
          reportUrl: reader.result as string,
        }));
        setFileName(file.name);
      } else {
        setError("PDF read nahi ho paayi.");
      }
    };

    reader.onerror = () => {
      setError("PDF read karte waqt error aaya.");
    };

    reader.readAsDataURL(file);
  }

  function validatePdfLink(value: string) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }

  function saveReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.patientName.trim() || !form.reportName.trim() || !form.date) {
      setError("Please fill all required details.");
      return;
    }

    if (!form.reportUrl) {
      setError(
        sourceType === "upload"
          ? "Please upload a PDF file."
          : "Please enter a PDF link."
      );
      return;
    }

    if (
      sourceType === "link" &&
      !form.reportUrl.startsWith("data:") &&
      !validatePdfLink(form.reportUrl)
    ) {
      setError("Please enter a valid HTTP or HTTPS link.");
      return;
    }

    const updatedReport: HealthReport = {
      id: editingId || `report-${Date.now()}`,
      patientName: form.patientName.trim(),
      reportName: form.reportName.trim(),
      date: form.date,
      reportUrl: form.reportUrl,
    };

    const updatedReports = editingId
      ? reports.map((report) =>
          report.id === editingId ? updatedReport : report
        )
      : [updatedReport, ...reports];

    setSaving(true);

    try {
      storage.saveReports(updatedReports);
      setReports(updatedReports);
      setModalOpen(false);
      setForm(emptyForm);
      setFileName("");
      setEditingId(null);
    } catch (err) {
      console.error("Unable to save report:", err);
      setError(
        "Report save nahi ho paayi. LocalStorage ki space full ho sakti hai."
      );
    } finally {
      setSaving(false);
    }
  }

  function deleteReport(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmed) return;

    const updatedReports = reports.filter((report) => report.id !== id);

    try {
      storage.saveReports(updatedReports);
      setReports(updatedReports);
    } catch (err) {
      console.error("Unable to delete report:", err);
      alert("Report delete nahi ho paayi.");
    }
  }

  function openReport(reportUrl: string) {
    if (reportUrl.startsWith("data:application/pdf")) {
      const newWindow = window.open();
      if (!newWindow) {
        alert("Please allow pop-ups to open the PDF.");
        return;
      }

      newWindow.document.write(
        `<iframe src="${reportUrl}" style="width:100%;height:100%;border:0" title="Patient PDF report"></iframe>`
      );
      newWindow.document.close();
      return;
    }

    window.open(reportUrl, "_blank", "noopener,noreferrer");
  }

  function downloadReport(report: HealthReport) {
    const anchor = document.createElement("a");
    anchor.href = report.reportUrl;
    anchor.download = `${report.reportName.replace(/[^a-z0-9-_]/gi, "_")}.pdf`;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-7">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Reports Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Upload, manage and share patient reports.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add New Report
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <FileText className="mb-3 text-blue-600" size={25} />
            <p className="text-sm text-slate-500">Total Reports</p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900">
              {reports.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Upload className="mb-3 text-emerald-600" size={25} />
            <p className="text-sm text-slate-500">PDF Reports</p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900">
              {
                reports.filter((report) =>
                  report.reportUrl.startsWith("data:application/pdf")
                ).length
              }
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="relative mb-6">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search patient or report name..."
              aria-label="Search reports"
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {loading ? (
            <p className="py-12 text-center text-slate-500">
              Loading reports...
            </p>
          ) : filteredReports.length === 0 ? (
            <div className="py-14 text-center">
              <FileText size={42} className="mx-auto mb-3 text-slate-300" />
              <h2 className="font-bold text-slate-700">
                {search ? "No matching reports found" : "No reports added yet"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Add a patient report using PDF upload or a report link.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <article
                  key={report.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                      <FileText size={23} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-bold text-slate-900">
                        {report.reportName}
                      </h2>
                      <p className="text-sm text-slate-500">
                        Patient: {report.patientName}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Date: {report.date}
                      </p>
                      <span className="mt-1 inline-block text-xs font-semibold text-blue-600">
                        {report.reportUrl.startsWith("data:application/pdf")
                          ? "Uploaded PDF"
                          : "External PDF link"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openReport(report.reportUrl)}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      <ExternalLink size={15} />
                      Open
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadReport(report)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Download size={15} />
                      Download
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditForm(report)}
                      aria-label={`Edit ${report.reportName}`}
                      className="rounded-lg bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteReport(report.id)}
                      aria-label={`Delete ${report.reportName}`}
                      className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-form-title"
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="report-form-title"
                className="text-xl font-extrabold text-slate-900"
              >
                {editingId ? "Edit Patient Report" : "Add Patient Report"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveReport} className="space-y-4">
              <div>
                <label
                  htmlFor="patientName"
                  className="mb-1 block text-sm font-semibold text-slate-700"
                >
                  Patient Name
                </label>
                <input
                  id="patientName"
                  required
                  value={form.patientName}
                  onChange={(event) =>
                    setForm({ ...form, patientName: event.target.value })
                  }
                  placeholder="Enter patient name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="reportName"
                  className="mb-1 block text-sm font-semibold text-slate-700"
                >
                  Report Name / Test Name
                </label>
                <input
                  id="reportName"
                  required
                  value={form.reportName}
                  onChange={(event) =>
                    setForm({ ...form, reportName: event.target.value })
                  }
                  placeholder="e.g. Complete Blood Count"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="reportDate"
                  className="mb-1 block text-sm font-semibold text-slate-700"
                >
                  Report Date
                </label>
                <input
                  id="reportDate"
                  type="date"
                  required
                  value={form.date}
                  onChange={(event) =>
                    setForm({ ...form, date: event.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Report Source
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSourceType("upload");
                      setForm({ ...form, reportUrl: "" });
                      setFileName("");
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold ${
                      sourceType === "upload"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <Upload size={17} />
                    Upload PDF
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSourceType("link");
                      setForm({ ...form, reportUrl: "" });
                      setFileName("");
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold ${
                      sourceType === "link"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <LinkIcon size={17} />
                    Paste Link
                  </button>
                </div>
              </div>

              {sourceType === "upload" ? (
                <div>
                  <label
                    htmlFor="pdfFile"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Select PDF file (maximum 1 MB)
                  </label>
                  <input
                    id="pdfFile"
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handlePdfUpload}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-blue-700"
                  />
                  {fileName && (
                    <p className="mt-2 break-all text-xs text-emerald-700">
                      Selected: {fileName}
                    </p>
                  )}
                  {form.reportUrl.startsWith("data:application/pdf") && (
                    <p className="mt-1 text-xs text-emerald-600">
                      PDF ready to save.
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="reportUrl"
                    className="mb-1 block text-sm font-semibold text-slate-700"
                  >
                    PDF URL
                  </label>
                  <input
                    id="reportUrl"
                    type="url"
                    value={form.reportUrl}
                    onChange={(event) =>
                      setForm({ ...form, reportUrl: event.target.value })
                    }
                    placeholder="https://example.com/report.pdf"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {error && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Add Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
