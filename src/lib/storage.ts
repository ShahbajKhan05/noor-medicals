import type {
  Appointment,
  Patient,
  LabBooking,
  HealthReport,
  PatientSession,
  AppNotification,
} from "@/types";

const STORAGE_KEYS = {
  appointments: "noor_appointments",
  patients: "noor_patients",
  labBookings: "noor_lab_bookings",
  reports: "noor_reports",

  // Patient login session
  patientSession: "noor_patient_session",

  // Patient notifications
  notifications: "noor_notifications",
};

function getData<T>(key: string): T[] {
  if (typeof window === "undefined") return [];

  try {
    const storedData = localStorage.getItem(key);

    return storedData ? (JSON.parse(storedData) as T[]) : [];
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return [];
  }
}

function saveData<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Unable to save ${key}:`, error);
  }
}

function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const storedData = localStorage.getItem(key);

    return storedData ? (JSON.parse(storedData) as T) : null;
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return null;
  }
}

function saveItem<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Unable to save ${key}:`, error);
  }
}

export const storage = {
  /* ========================================
     APPOINTMENTS
  ======================================== */

  getAppointments: () =>
    getData<Appointment>(STORAGE_KEYS.appointments),

  saveAppointments: (data: Appointment[]) =>
    saveData(STORAGE_KEYS.appointments, data),

  /* ========================================
     PATIENTS
  ======================================== */

  getPatients: () =>
    getData<Patient>(STORAGE_KEYS.patients),

  savePatients: (data: Patient[]) =>
    saveData(STORAGE_KEYS.patients, data),

  /* ========================================
     LAB BOOKINGS
  ======================================== */

  getLabBookings: () =>
    getData<LabBooking>(STORAGE_KEYS.labBookings),

  saveLabBookings: (data: LabBooking[]) =>
    saveData(STORAGE_KEYS.labBookings, data),

  /* ========================================
     HEALTH REPORTS
  ======================================== */

  getReports: () =>
    getData<HealthReport>(STORAGE_KEYS.reports),

  saveReports: (data: HealthReport[]) =>
    saveData(STORAGE_KEYS.reports, data),

  /* ========================================
     PATIENT LOGIN / SESSION
  ======================================== */

  getPatientSession: () =>
    getItem<PatientSession>(STORAGE_KEYS.patientSession),

  loginPatient: (patient: Patient) => {
    const session: PatientSession = {
      patientId: patient.id,
      phone: patient.phone,
      loggedInAt: new Date().toISOString(),
    };

    saveItem(STORAGE_KEYS.patientSession, session);

    return session;
  },

  logoutPatient: () => {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(STORAGE_KEYS.patientSession);
    } catch (error) {
      console.error("Unable to logout patient:", error);
    }
  },

  getCurrentPatient: (): Patient | null => {
    const session = getItem<PatientSession>(
      STORAGE_KEYS.patientSession
    );

    if (!session) return null;

    const patients = getData<Patient>(STORAGE_KEYS.patients);

    return (
      patients.find(
        (patient) => patient.id === session.patientId
      ) || null
    );
  },

  /* ========================================
     PATIENT-WISE DATA FILTERS  ⭐ NEW
  ======================================== */

  /**
   * Returns ONLY the appointments belonging to the given patient.
   * Primary match: patientId (secure)
   * Fallback (old data): phone AND name both match
   */
  getPatientAppointments: (patient: Patient): Appointment[] => {
    const all = getData<Appointment>(STORAGE_KEYS.appointments);

    return all
      .filter((appointment) => {
        // Primary: patientId match (new bookings)
        if (appointment.patientId && patient.id) {
          return appointment.patientId === patient.id;
        }

        // Fallback: old bookings without patientId
        // Use AND (not OR) to prevent data leakage
        return (
          appointment.phone === patient.phone &&
          appointment.patientName === patient.name
        );
      })
      .sort((a, b) => {
        const aTime = a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0;
        const bTime = b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0;
        return bTime - aTime;
      });
  },

  /**
   * Returns ONLY the lab bookings belonging to the given patient.
   */
  getPatientLabBookings: (patient: Patient): LabBooking[] => {
    const all = getData<LabBooking>(STORAGE_KEYS.labBookings);

    return all
      .filter((booking) => {
        if (booking.patientId && patient.id) {
          return booking.patientId === patient.id;
        }

        return (
          booking.phone === patient.phone &&
          booking.patientName === patient.name
        );
      })
      .sort((a, b) => {
        const aTime = a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0;
        const bTime = b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0;
        return bTime - aTime;
      });
  },

  /**
   * Returns ONLY the health reports belonging to the given patient.
   */
  getPatientReports: (patient: Patient): HealthReport[] => {
    const all = getData<HealthReport>(STORAGE_KEYS.reports);

    return all
      .filter((report) => {
        if (report.patientId && patient.id) {
          return report.patientId === patient.id;
        }
        return report.patientName === patient.name;
      })
      .sort((a, b) => {
        return (
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
        );
      });
  },

  /* ========================================
     NOTIFICATIONS
  ======================================== */

  getNotifications: () =>
    getData<AppNotification>(STORAGE_KEYS.notifications),

  saveNotifications: (data: AppNotification[]) =>
    saveData(STORAGE_KEYS.notifications, data),

  getPatientNotifications: (patientId: string) => {
    return getData<AppNotification>(STORAGE_KEYS.notifications)
      .filter(
        (notification) =>
          notification.patientId === patientId
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
  },

  getUnreadNotificationsCount: (patientId: string) => {
    return getData<AppNotification>(STORAGE_KEYS.notifications)
      .filter(
        (notification) =>
          notification.patientId === patientId &&
          !notification.isRead
      ).length;
  },

  addNotification: (notification: AppNotification) => {
    const notifications =
      getData<AppNotification>(STORAGE_KEYS.notifications);

    saveData(STORAGE_KEYS.notifications, [
      notification,
      ...notifications,
    ]);
  },

  markNotificationAsRead: (notificationId: string) => {
    const notifications =
      getData<AppNotification>(STORAGE_KEYS.notifications);

    const updatedNotifications = notifications.map(
      (notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
    );

    saveData(
      STORAGE_KEYS.notifications,
      updatedNotifications
    );
  },

  markAllNotificationsAsRead: (patientId: string) => {
    const notifications =
      getData<AppNotification>(STORAGE_KEYS.notifications);

    const updatedNotifications = notifications.map(
      (notification) =>
        notification.patientId === patientId
          ? { ...notification, isRead: true }
          : notification
    );

    saveData(
      STORAGE_KEYS.notifications,
      updatedNotifications
    );
  },
};