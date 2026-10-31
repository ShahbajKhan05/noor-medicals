"use client";

import { useEffect, useMemo, useState } from "react";
import { storage } from "@/lib/storage";
import { getLabTests } from "@/lib/lab-tests";
import type { LabTest, LabBooking } from "@/types";
import {
  Search,
  FlaskConical,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";

export default function LabTestCatalog() {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedTest, setSelectedTest] = useState("");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [today, setToday] = useState("");
  const [message, setMessage] = useState("");

  function refreshTests() {
    setTests(getLabTests());
  }

  useEffect(() => {
    const localToday = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    setToday(localToday);
    refreshTests();

    window.addEventListener("storage", refreshTests);
    window.addEventListener("focus", refreshTests);
    window.addEventListener("lab-tests-updated", refreshTests);

    return () => {
      window.removeEventListener("storage", refreshTests);
      window.removeEventListener("focus", refreshTests);
      window.removeEventListener("lab-tests-updated", refreshTests);
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(tests.map((test) => test.category)))],
    [tests]
  );

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const query = search.toLowerCase();

      const matchesSearch =
        test.name.toLowerCase().includes(query) ||
        test.description.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || test.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [tests, search, category]);

  function handleBooking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const selected = tests.find((test) => test.id === selectedTest);

    if (!selected) {
      setMessage("Selected test is no longer available.");
      return;
    }

    const booking: LabBooking = {
      id: crypto.randomUUID(),
      patientName: patientName.trim(),
      phone: phone.trim(),
      testName: selected.name,
      date,
      time: "Not specified",
      address: "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = storage.getLabBookings();
      storage.saveLabBookings([...existing, booking]);

      setMessage("Test booking request saved successfully!");
      setPatientName("");
      setPhone("");
      setDate("");
      setSelectedTest("");
    } catch {
      setMessage("Unable to save request. Please try again.");
    }
  }

  return (
    <div className="space-y-7">
      <div className="glass-card p-4">
        <label
          htmlFor="test-search"
          className="mb-3 block text-sm font-bold text-slate-800"
        >
          Search Laboratory Tests
        </label>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4">
          <Search size={20} className="text-slate-400" />
          <input
            id="test-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search CBC, thyroid, sugar..."
            className="min-h-12 w-full bg-transparent text-sm outline-none"
          />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`min-h-10 shrink-0 rounded-full px-4 text-xs font-semibold ${
                category === item
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-cyan-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Available Lab Tests
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a test to submit your booking request.
            </p>
          </div>

          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
            {filteredTests.length} Tests
          </span>
        </div>

        {filteredTests.length === 0 ? (
          <div className="glass-card p-8 text-center text-sm text-slate-500">
            No matching tests found.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTests.map((test) => (
              <article
                key={test.id}
                className="glass-card flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                  <FlaskConical size={23} />
                </div>

                <p className="text-xs font-semibold text-cyan-700">
                  {test.category}
                </p>

                <h3 className="mt-2 font-bold text-slate-900">
                  {test.name}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                  {test.description}
                </p>

                <p className="mt-4 text-sm font-bold text-slate-800">
                  Price: ₹{test.price}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedTest(test.id);
                    setMessage("");
                    document.getElementById("test-booking")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-700"
                >
                  <CalendarDays size={17} />
                  Book This Test
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      <section
        id="test-booking"
        className="glass-card scroll-mt-6 p-5 sm:p-8"
      >
        <h2 className="text-xl font-extrabold text-slate-900">
          Book a Lab Test
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Enter your details to submit a test booking request.
        </p>

        <form onSubmit={handleBooking} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="lab-patient-name"
              className="mb-2 block text-sm font-semibold"
            >
              Patient Name *
            </label>
            <input
              id="lab-patient-name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
              maxLength={80}
              autoComplete="name"
              placeholder="Enter patient name"
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="lab-phone"
                className="mb-2 block text-sm font-semibold"
              >
                Mobile Number *
              </label>
              <input
                id="lab-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                pattern="[6-9][0-9]{9}"
                title="Enter a valid 10-digit Indian mobile number"
                maxLength={10}
                required
                autoComplete="tel"
                placeholder="10-digit mobile number"
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label
                htmlFor="lab-date"
                className="mb-2 block text-sm font-semibold"
              >
                Preferred Date *
              </label>
              <input
                id="lab-date"
                type="date"
                min={today || undefined}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={!today}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="selected-test"
              className="mb-2 block text-sm font-semibold"
            >
              Select Test *
            </label>
            <select
              id="selected-test"
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-cyan-500"
            >
              <option value="">Choose a test</option>
              {tests.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.name} — ₹{test.price}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!today || tests.length === 0}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-bold text-white shadow-lg shadow-cyan-100 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CalendarDays size={19} />
            Submit Test Request
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
    </div>
  );
}