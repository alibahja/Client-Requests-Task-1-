import type { ClientRequest, RequestStatus } from "../../types";
import { RequestRow } from "./RequestRow";

interface Props {
  requests: ClientRequest[];
  updatingIds: Set<string>;
  onStatusChange: (id: string, status: RequestStatus) => void;
}

export function RequestsTable({ requests, updatingIds, onStatusChange }: Props) {
  if (requests.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-sm text-gray-500">
          No client requests yet. Click <span className="font-medium">+ New Request</span> to add one.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="w-full">
        <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Request</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <RequestRow
              key={r._id}
              request={r}
              isUpdating={updatingIds.has(r._id)}
              onStatusChange={onStatusChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}