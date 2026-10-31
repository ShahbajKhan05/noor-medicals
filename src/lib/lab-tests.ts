
import type { LabTest } from "@/types";

const STORAGE_KEY = "swastik_admin_lab_tests";

export const defaultLabTests: LabTest[] = [
  {
    id: "cbc",
    name: "Complete Blood Count (CBC)",
    description: "Measures different components of blood.",
    price: 350,
    category: "Blood Test",
  },
  {
    id: "sugar",
    name: "Blood Sugar Test",
    description: "Measures blood glucose levels.",
    price: 100,
    category: "Diabetes",
  },
  {
    id: "thyroid",
    name: "Thyroid Profile",
    description: "Evaluates thyroid hormone levels.",
    price: 500,
    category: "Hormones",
  },
  {
    id: "lipid",
    name: "Lipid Profile",
    description: "Measures cholesterol and triglycerides.",
    price: 600,
    category: "Blood Test",
  },
];

export function getLabTests(): LabTest[] {
  if (typeof window === "undefined") return defaultLabTests;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultLabTests)
      );
      return defaultLabTests;
    }

    const parsed: unknown = JSON.parse(saved);

    return Array.isArray(parsed)
      ? (parsed as LabTest[])
      : defaultLabTests;
  } catch {
    return defaultLabTests;
  }
}

export function saveLabTests(tests: LabTest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
  window.dispatchEvent(new Event("lab-tests-updated"));
}
