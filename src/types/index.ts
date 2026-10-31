
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
  patientName: string;
  reportName: string;
  reportUrl: string;
  date: string;
};
