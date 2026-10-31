
interface StatusBadgeProps {
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    pending: "bg-amber-100 text-amber-700 ring-amber-200",
    confirmed: "bg-blue-100 text-blue-700 ring-blue-200",
    completed: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    cancelled: "bg-red-100 text-red-700 ring-red-200",
  };

  const labels = {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}
