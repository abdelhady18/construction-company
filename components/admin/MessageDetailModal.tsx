"use client";

import { useEffect } from "react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

interface MessageDetailModalProps {
  message: Message;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function MessageDetailModal({
  message,
  onClose,
  onMarkRead,
  onDelete,
}: MessageDetailModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-surface shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-heading">Message Details</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-2xl leading-none text-muted hover:text-foreground"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Name</p>
              <p className="mt-0.5 text-foreground">{message.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Date</p>
              <p className="mt-0.5 text-foreground">
                {new Date(message.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Email</p>
              <p className="mt-0.5 break-all text-foreground">{message.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Phone</p>
              <p className="mt-0.5 text-foreground">{message.phone || "—"}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Status</p>
            <p className="mt-0.5">
              {message.read ? (
                <span className="inline-block rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">
                  Read
                </span>
              ) : (
                <span className="inline-block rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700">
                  New
                </span>
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Message</p>
            <p className="mt-1 whitespace-pre-wrap rounded-lg bg-background p-4 text-sm leading-relaxed text-foreground border border-border">
              {message.message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-muted hover:bg-background"
          >
            Close
          </button>
          {!message.read && (
            <button
              onClick={() => { onMarkRead(message.id); onClose(); }}
              className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
            >
              Mark as Read
            </button>
          )}
          <button
            onClick={() => {
              if (confirm("Delete this message?")) {
                onDelete(message.id);
                onClose();
              }
            }}
            className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
