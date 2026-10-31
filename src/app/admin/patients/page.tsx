
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Users,
  Search,
  Phone,
  UserRound,
  CalendarDays,
  Trash2,
  RefreshCw,
  Mars,
  Venus,
  Eye,
  X,
} from "lucide-react";

import { storage } from "@/lib/storage";
import type { Patient } from "@/types";

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const loadPatients = useCallback(() => {
    try {
      setError("");

      const records = storage.getPatients();

      const sorted = [...records].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return (
          (Number.isFinite(dateB) ? dateB : 0) -
          (Number.isFinite(dateA) ? dateA : 0)
        );
      });

      setPatients(sorted);
    } catch (err) {
      console.error("Unable to load patients:", err);
      setError("Patient records load nahi ho paye.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();

    window.addEventListener("storage", loadPatients);
    window.addEventListener("focus", loadPatients);

    return () => {
      window.removeEventListener("storage", loadPatients);
      window.removeEventListener("focus", loadPatients);
    };
  }, [loadPatients]);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    return patients.filter((patient) => {
      const matchesSearch =
        (patient.name || "").toLowerCase().includes(query) ||
        (patient.phone || "").includes(query);

      const matchesGender =
        genderFilter === "all" ||
        patient.gender?.toLowerCase() === genderFilter;

      return matchesSearch && matchesGender;
    });
  }, [patients, search, genderFilter]);

  const counts = useMemo(
    () => ({
      total: patients.length,
      male: patients.filter((p) => p.gender === "Male").length,
      female: patients.filter((p) => p.gender === "Female").length,
      other: patients.filter((p) => p.gender === "Other").length,
    }),
    [patients]
  );

  function deletePatient(id: string) {
    const confirmed = window.confirm(
      "Kya aap is patient record ko permanently delete karna chahte hain?"
    );

    if (!confirmed) return;

    try {
      const updated = patients.filter((patient) => patient.id !== id);

      storage.savePatients(updated);
      setPatients(updated);

      if (selectedPatient?.id === id) {
        setSelectedPatient(null);
      }
    } catch (err) {
      console.error("Unable to delete patient:", err);
      alert("Patient record delete nahi ho paya.");
    }
  }

  function formatDate(value: string) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const statCards = [
    {
      label: "Total Patients",
      value: counts.total,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Male Patients",
      value: counts.male,
      icon: Mars,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Female Patients",
      value: counts.female,
      icon: Venus,
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
    {
      label: "Other",
      value: counts.other,
      icon: UserRound,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-slate-50 p-3 sm:p-5 lg:p-7">
      <div className="mx-auto w-full min-w-0 max-w-7xl">

        {/* BACK BUTTON */}
        <Link
          href="/admin"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* HEADER */}
        <header className="mb-6 flex min-w-0 flex-col gap-4 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Patient Management
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              View, search and manage registered clinic patients.
            </p>
          </div>

          <button
            type="button"
            onClick={loadPatients}
            className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        {/* STATISTICS */}
        <section className="mb-6 grid min-w-0 grid-cols-1 gap-3 min-[400px]:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}
                >
                  <Icon size={20} className={item.color} />
                </div>

                <p className="text-sm text-slate-500">{item.label}</p>

                <p className={`mt-2 text-2xl font-extrabold sm:text-3xl ${item.color}`}>
                  {item.value}
                </p>
              </div>
            );
          })}
        </section>

        {/* PATIENT LIST */}
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
              Registered Patients
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search and manage patient information.
            </p>
          </div>

          {/* SEARCH AND FILTER */}
          <div className="mb-6 flex min-w-0 flex-col gap-3 md:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search patient name or phone number..."
                aria-label="Search patients"
                className="min-h-12 w-full min-w-0 rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={genderFilter}
              onChange={(event) => setGenderFilter(event.target.value)}
              aria-label="Filter patients by gender"
              className="min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 md:w-52"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="mb-4 break-words rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="py-12 text-center text-slate-500">
              Loading patients...
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="py-14 text-center">
              <Users
                size={42}
                className="mx-auto mb-3 text-slate-300"
              />

              <h2 className="font-bold text-slate-700">
                {search || genderFilter !== "all"
                  ? "No matching patients found"
                  : "No patients registered"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Patient records will appear here when registered.
              </p>

              {(search || genderFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setGenderFilter("all");
                  }}
                  className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* MOBILE AND TABLET CARDS */}
              <div className="grid min-w-0 grid-cols-1 gap-3 lg:hidden">
                {filteredPatients.map((patient) => (
                  <article
                    key={patient.id}
                    className="min-w-0 rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <UserRound size={21} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="break-words font-bold text-slate-900">
                            {patient.name}
                          </h3>
                          <p className="mt-1 text-xs text-slate-400">
                            Patient Record
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {patient.gender}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
                      <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
                        <Phone size={16} className="shrink-0 text-slate-400" />
                        <span className="break-all">{patient.phone}</span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
                        <CalendarDays size={16} className="shrink-0 text-slate-400" />
                        <span>{patient.age} years</span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600 min-[400px]:col-span-2">
                        <CalendarDays size={16} className="shrink-0 text-slate-400" />
                        <span>Registered: {formatDate(patient.createdAt)}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => setSelectedPatient(patient)}
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => deletePatient(patient.id)}
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-4 font-semibold">Patient</th>
                      <th className="px-4 py-4 font-semibold">Phone</th>
                      <th className="px-4 py-4 font-semibold">Age</th>
                      <th className="px-4 py-4 font-semibold">Gender</th>
                      <th className="px-4 py-4 font-semibold">Registered</th>
                      <th className="px-4 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="border-b border-slate-50 transition hover:bg-slate-50"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                              <UserRound size={19} />
                            </div>
                            <span className="font-semibold text-slate-800">
                              {patient.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {patient.phone}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {patient.age} years
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {patient.gender}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {formatDate(patient.createdAt)}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedPatient(patient)}
                              aria-label={`View ${patient.name}`}
                              className="rounded-lg border border-blue-100 p-2 text-blue-600 hover:bg-blue-50"
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() => deletePatient(patient.id)}
                              aria-label={`Delete ${patient.name}`}
                              className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {!loading && filteredPatients.length > 0 && (
            <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
              Showing {filteredPatients.length} of {patients.length} patients
            </p>
          )}
        </section>

        {/* PATIENT DETAILS MODAL */}
        {selectedPatient && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 sm:p-5"
            onClick={() => setSelectedPatient(null)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="patient-modal-title"
              className="my-auto max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2
                  id="patient-modal-title"
                  className="text-lg font-extrabold text-slate-900 sm:text-xl"
                >
                  Patient Details
                </h2>

                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  aria-label="Close patient details"
                  className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-5 flex min-w-0 items-center gap-3 rounded-xl bg-blue-50 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600">
                  <UserRound size={24} />
                </div>

                <div className="min-w-0">
                  <h3 className="break-words font-bold text-slate-900">
                    {selectedPatient.name}
                  </h3>
                  <p className="text-sm text-slate-500">Patient Record</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-3">
                  <span className="text-slate-500">Phone</span>
                  <span className="break-all font-semibold text-slate-800">
                    {selectedPatient.phone}
                  </span>
                </div>

                <div className="flex justify-between gap-3 border-b border-slate-100 pb-3">
                  <span className="text-slate-500">Age</span>
                  <span className="font-semibold text-slate-800">
                    {selectedPatient.age} years
                  </span>
                </div>

                <div className="flex justify-between gap-3 border-b border-slate-100 pb-3">
                  <span className="text-slate-500">Gender</span>
                  <span className="font-semibold text-slate-800">
                    {selectedPatient.gender}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Registered</span>
                  <span className="font-semibold text-slate-800">
                    {formatDate(selectedPatient.createdAt)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="mt-6 min-h-11 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Close
              </button>
            </section>
          </div>
        )}

        <footer className="py-6 text-center text-xs text-slate-400">
          © 2026 Swastik Clinic · Patient Management
        </footer>
      </div>
    </main>
  );
}
