import { useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { RequestsTable } from "../components/requests/RequestsTable";
import { CreateRequestModal } from "../components/requests/CreateRequestModal";
import { Button } from "../components/common/Button";
import { Spinner } from "../components/common/Spinner";
import { useRequests } from "../hooks/useRequests";
import type { CreateRequestPayload, RequestStatus } from "../types";

export function DashboardPage() {
  const {
    requests,
    isLoading,
    error,
    refetch,
    createRequest,
    updateStatus,
  } = useRequests();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [statusError, setStatusError] = useState<string | null>(null);

  async function handleCreate(payload: CreateRequestPayload) {
    await createRequest(payload);
  }

  async function handleStatusChange(id: string, status: RequestStatus) {
    setStatusError(null);
    setUpdatingIds((prev) => new Set(prev).add(id));
    try {
      await updateStatus(id, status);
    } catch (err) {
      setStatusError(
        err instanceof Error ? err.message : "Could not update status"
      );
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Requests</h1>
            <p className="text-sm text-gray-600">
              Manage incoming requests and track their progress
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>+ New Request</Button>
        </div>

        {statusError && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {statusError}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-6 text-center">
            <p className="mb-3 text-sm text-red-700">{error}</p>
            <Button variant="secondary" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <RequestsTable
            requests={requests}
            updatingIds={updatingIds}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      <CreateRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}