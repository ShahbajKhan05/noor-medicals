
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { LabTest } from "@/types";
import { getLabTests, saveLabTests } from "@/lib/lab-tests";
import {
  ArrowLeft,
  FlaskConical,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  Layers,
} from "lucide-react";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
};

export default function AdminLabTestsPage() {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setTests(getLabTests());
    } catch (err) {
      console.error("Unable to load lab tests:", err);
      setError("Unable to load lab tests.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      saveLabTests(tests);
    } catch (err) {
      console.error("Unable to save lab tests:", err);
      setError("Lab tests save nahi ho paye.");
    }
  }, [tests, ready]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(tests.map((test) => test.category.trim()).filter(Boolean))
      ).sort(),
    [tests]
  );

  const filteredTests = useMemo(() => {
    const query = search.toLowerCase().trim();

    return tests.filter((test) => {
      const matchesSearch =
        test.name.toLowerCase().includes(query) ||
        test.category.toLowerCase().includes(query) ||
        test.description.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "all" || test.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [tests, search, categoryFilter]);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEditForm(test: LabTest) {
    setEditingId(test.id);

    setForm({
      name: test.name,
      description: test.description,
      price: String(test.price),
      category: test.category,
    });

    setError("");
    setModalOpen(true);
  }

  function saveTest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const category = form.category.trim();
    const price = Number(form.price);

    if (!name || !category || form.price.trim() === "") {
      setError("Please fill all required fields.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Please enter a valid test price.");
      return;
    }

    const duplicate = tests.some(
      (test) =>
        test.id !== editingId &&
        test.name.trim().toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
      setError("This lab test already exists.");
      return;
    }

    if (editingId) {
      setTests((current) =>
        current.map((test) =>
          test.id === editingId
            ? {
                ...test,
                name,
                description: form.description.trim(),
                price,
                category,
              }
            : test
        )
      );
    } else {
      setTests((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          name,
          description: form.description.trim(),
          price,
          category,
        },
      ]);
    }

    setModalOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  }

  function deleteTest(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this lab test?"
    );

    if (!confirmed) return;

    setTests((current) => current.filter((test) => test.id !== id));
  }

  function refreshTests() {
    try {
      setTests(getLabTests());
      setError("");
    } catch (err) {
      console.error("Unable to refresh lab tests:", err);
      setError("Lab tests refresh nahi ho paye.");
    }
  }

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-slate-50 p-3 sm:p-5 lg:p-7">
      <div className="mx-auto w-full min-w-0 max-w-7xl">

        {/* BACK LINK */}
        <Link
          href="/admin"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* HEADER */}
        <header className="mb-6 flex min-w-0 flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Lab Test Management
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Add, edit, search and manage pathology tests.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto">
            <button
              type="button"
              onClick={refreshTests}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:px-4"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-sm font-bold text-white transition hover:bg-blue-700 sm:px-5"
            >
              <Plus size={18} />
              Add Test
            </button>
          </div>
        </header>

        {/* STATISTICS */}
        <section className="mb-6 grid min-w-0 grid-cols-1 gap-3 min-[400px]:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FlaskConical size={23} />
            </div>
            <p className="text-sm text-slate-500">Total Lab Tests</p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900">
              {ready ? tests.length : "—"}
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Layers size={23} />
            </div>
            <p className="text-sm text-slate-500">Listed Categories</p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900">
              {ready ? categories.length : "—"}
            </p>
          </div>
        </section>

        {/* TEST CATALOG */}
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
              Available Lab Tests
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage your clinic&apos;s test catalogue and pricing.
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
                placeholder="Search test name, category or description..."
                aria-label="Search lab tests"
                className="min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              aria-label="Filter by category"
              className="min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 md:w-56"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
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
          {!ready ? (
            <p className="py-10 text-center text-slate-500">
              Loading tests...
            </p>
          ) : filteredTests.length === 0 ? (
            <div className="py-12 text-center">
              <FlaskConical
                size={40}
                className="mx-auto mb-3 text-slate-300"
              />
              <p className="font-semibold text-slate-700">
                No lab tests found.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Try another search or add a new test.
              </p>
            </div>
          ) : (
            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredTests.map((test) => (
                <article
                  key={test.id}
                  className="min-w-0 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:shadow-sm sm:p-5"
                >
                  <div className="flex min-w-0 flex-col gap-3 min-[450px]:flex-row min-[450px]:items-start min-[450px]:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="shrink-0 rounded-xl bg-blue-50 p-3 text-blue-600">
                        <FlaskConical size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="break-words font-bold text-slate-900">
                          {test.name}
                        </h3>
                        <p className="mt-1 break-words text-xs font-medium text-blue-600">
                          {test.category}
                        </p>
                      </div>
                    </div>

                    <p className="shrink-0 text-lg font-extrabold text-slate-900">
                      ₹{test.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <p className="mt-4 break-words text-sm leading-6 text-slate-500">
                    {test.description || "No description provided."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => openEditForm(test)}
                      className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 sm:flex-none"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteTest(test.id)}
                      className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 sm:flex-none"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {ready && filteredTests.length > 0 && (
            <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
              Showing {filteredTests.length} of {tests.length} lab tests
            </p>
          )}
        </section>

        {/* ADD / EDIT MODAL */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 sm:p-5"
            onClick={() => setModalOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="lab-test-form-title"
              className="my-auto max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2
                  id="lab-test-form-title"
                  className="text-lg font-extrabold text-slate-900 sm:text-xl"
                >
                  {editingId ? "Edit Lab Test" : "Add New Lab Test"}
                </h2>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close form"
                  className="shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveTest} className="space-y-4">
                <div>
                  <label
                    htmlFor="test-name"
                    className="mb-1 block text-sm font-semibold text-slate-700"
                  >
                    Test Name *
                  </label>
                  <input
                    id="test-name"
                    required
                    maxLength={120}
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    placeholder="e.g. Complete Blood Count"
                    className="min-h-11 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="test-category"
                    className="mb-1 block text-sm font-semibold text-slate-700"
                  >
                    Category *
                  </label>
                  <input
                    id="test-category"
                    required
                    maxLength={80}
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                    placeholder="e.g. Blood Test"
                    className="min-h-11 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="test-price"
                    className="mb-1 block text-sm font-semibold text-slate-700"
                  >
                    Price (₹) *
                  </label>
                  <input
                    id="test-price"
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      setForm({ ...form, price: event.target.value })
                    }
                    placeholder="Enter test price"
                    className="min-h-11 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="test-description"
                    className="mb-1 block text-sm font-semibold text-slate-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="test-description"
                    rows={3}
                    maxLength={500}
                    value={form.description}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        description: event.target.value,
                      })
                    }
                    placeholder="Enter short test description"
                    className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {error && (
                  <p role="alert" className="break-words text-sm text-red-600">
                    {error}
                  </p>
                )}

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="min-h-11 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="min-h-11 flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    {editingId ? "Save Changes" : "Add Test"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <footer className="py-6 text-center text-xs text-slate-400">
          © 2026 Swastik Clinic · Lab Test Management
        </footer>
      </div>
    </main>
  );
}
