export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type Patient = {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  createdAt: string;
};

export type Appointment = {
  id: string;
  patientId?: string;      // 👈 ADDED (optional for old data)
  patientName: string;
  phone: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  createdAt: string;
};

export type LabTest = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
};

export type LabBooking = {
  id: string;
  patientId?: string;      // 👈 ADDED (optional for old data)
  patientName: string;
  phone: string;
  testName: string;
  date: string;
  time: string;
  address: string;
  status: AppointmentStatus;
  createdAt: string;
};

export type HealthReport = {
  id: string;
  patientId?: string;      // 👈 ADDED
  patientName: string;
  reportName: string;
  reportUrl: string;
  date: string;
};

/* ================================
   PATIENT LOGIN SESSION
================================ */

export type PatientSession = {
  patientId: string;
  phone: string;
  loggedInAt: string;
};

/* ================================
   NOTIFICATIONS
================================ */

export type NotificationType =
  | "appointment"
  | "lab-booking"
  | "home-collection"
  | "report"
  | "general";

export type AppNotification = {
  id: string;
  patientId: string;
  phone: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  link?: string;
};