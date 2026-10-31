
import type {
  Appointment,
  Patient,
  LabBooking,
  HealthReport,
} from "@/types";

const STORAGE_KEYS = {
  appointments: "swastik_appointments",
  patients: "swastik_patients",
  labBookings: "swastik_lab_bookings",
  reports: "swastik_reports",
};

function getData<T>(key: string): T[] {
  if (typeof window === "undefined") return [];

  try {
    const storedData = localStorage.getItem(key);
    return storedData ? (JSON.parse(storedData) as T[]) : [];
  } catch {
    return [];
  }
}

function saveData<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(key, JSON.stringify(data));
}

export const storage = {
  getAppointments: () => getData<Appointment>(STORAGE_KEYS.appointments),

  saveAppointments: (data: Appointment[]) =>
    saveData(STORAGE_KEYS.appointments, data),

  getPatients: () => getData<Patient>(STORAGE_KEYS.patients),

  savePatients: (data: Patient[]) =>
    saveData(STORAGE_KEYS.patients, data),

  getLabBookings: () => getData<LabBooking>(STORAGE_KEYS.labBookings),

  saveLabBookings: (data: LabBooking[]) =>
    saveData(STORAGE_KEYS.labBookings, data),

  getReports: () => getData<HealthReport>(STORAGE_KEYS.reports),

  saveReports: (data: HealthReport[]) =>
    saveData(STORAGE_KEYS.reports, data),
};
