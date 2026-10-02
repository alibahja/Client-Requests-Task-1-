import type { ClientRequest, RequestStatus } from "../../types";
import { StatusBadge } from "./StatusBadge";
import { StatusDropdown } from "./StatusDropdown";
import { formatDate } from "../../utils/format";

interface Props {
  request: ClientRequest;
  isUpdating: boolean;
  onStatusChange: (id: string, status: RequestStatus) => void;
}

export function RequestRow({ request, isUpdating, onStatusChange }: Props) {
  return (
    <tr className="border-b border-gray-100 transition hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="text-sm font-medium text-gray-900">{request.clientName}</div>
        <div className="text-xs text-gray-500">{request.clientEmail}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-gray-900">{request.title}</div>
        {request.description && (
          <div className="line-clamp-1 text-xs text-gray-500">{request.description}</div>
        )}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={request.status} />
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(request.createdAt)}</td>
      <td className="px-4 py-3">
        <StatusDropdown
          value={request.status}
          disabled={isUpdating}
          onChange={(s) => onStatusChange(request._id, s)}
        />
      </td>
    </tr>
  );
}