import { useCallback, useEffect, useState } from "react";
import { requestsApi } from "../api/requests.api";
import type {
  ClientRequest,
  CreateRequestPayload,
  RequestStatus,
} from "../types";

interface UseRequestsResult {
  requests: ClientRequest[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createRequest: (payload: CreateRequestPayload) => Promise<void>;
  updateStatus: (id: string, status: RequestStatus) => Promise<void>;
}

export function useRequests(): UseRequestsResult {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await requestsApi.list();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const createRequest = useCallback(async (payload: CreateRequestPayload) => {
    const created = await requestsApi.create(payload);
    // Prepend — matches the backend's newest-first ordering
    setRequests((prev) => [created, ...prev]);
  }, []);

  const updateStatus = useCallback(
    async (id: string, status: RequestStatus) => {
      // Optimistic update: swap locally first, roll back on failure
      const previous = requests;

      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );

      try {
        const updated = await requestsApi.updateStatus(id, status);
        // Reconcile with server response (source of truth)
        setRequests((prev) =>
          prev.map((r) => (r._id === updated._id ? updated : r))
        );
      } catch (err) {
        setRequests(previous); // rollback
        throw err;
      }
    },
    [requests]
  );

  return {
    requests,
    isLoading,
    error,
    refetch: fetchAll,
    createRequest,
    updateStatus,
  };
}