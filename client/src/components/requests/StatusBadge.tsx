import type { RequestStatus } from "../../types";

const styles: Record<RequestStatus, string> = {
  New: "bg-blue-50 text-blue-700 ring-blue-600/20",
  "In Progress": "bg-amber-50 text-amber-700 ring-amber-600/20",
  Done: "bg-green-50 text-green-700 ring-green-600/20",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {status}
    </span>
  );
}