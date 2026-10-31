
import type { Metadata } from "next";
import AdminReportsManager from "../../../components/AdminReportsManager";

export const metadata: Metadata = {
  title: "Reports Management | Swastik Clinic",
  description: "Manage patient pathology reports.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminReportsPage() {
  return <AdminReportsManager />;
}
