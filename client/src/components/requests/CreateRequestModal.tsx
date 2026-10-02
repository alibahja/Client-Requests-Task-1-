import { type FormEvent, useEffect, useState } from "react";
import { Modal } from "../common/Modal";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import type { CreateRequestPayload } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: CreateRequestPayload) => Promise<void>;
}

const emptyForm = {
  clientName: "",
  clientEmail: "",
  title: "",
  description: "",
};

export function CreateRequestModal({ isOpen, onClose, onCreate }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form every time the modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(emptyForm);
      setError(null);
    }
  }, [isOpen]);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onCreate({
        clientName: form.clientName.trim(),
        clientEmail: form.clientEmail.trim(),
        title: form.title.trim(),
        description: form.description.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create request");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Client Request">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Client name"
          name="clientName"
          required
          value={form.clientName}
          onChange={(e) => update("clientName", e.target.value)}
        />
        <Input
          label="Client email"
          type="email"
          name="clientEmail"
          required
          value={form.clientEmail}
          onChange={(e) => update("clientEmail", e.target.value)}
        />
        <Input
          label="Request title"
          name="title"
          placeholder="e.g. Website redesign"
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
}