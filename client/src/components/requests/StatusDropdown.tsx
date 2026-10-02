import type { RequestStatus } from "../../types";
import { REQUEST_STATUSES } from "../../types";

interface Props {
  value: RequestStatus;
  disabled?: boolean;
  onChange: (status: RequestStatus) => void;
}

export function StatusDropdown({ value, disabled, onChange }: Props) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as RequestStatus)}
      className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 outline-none transition focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {REQUEST_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}