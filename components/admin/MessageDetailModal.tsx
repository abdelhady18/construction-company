"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";

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
  const t = useTranslations("messageModal");
  const locale = useLocale();
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    const prev = document.activeElement as HTMLElement | null;
    const el = document.getElementById("message-dialog");
    const focusable = el?.querySelector<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    focusable?.focus();
    return () => {
      document.removeEventListener("keydown", handler);
      prev?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
    >
      <div
        id="message-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-dialog-title"
        className="w-full max-w-lg rounded-xl bg-surface shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 id="message-dialog-title" className="text-lg font-bold text-heading">{t("title")}</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-2xl leading-none text-muted hover:text-foreground"
            aria-label={t("close")}
          >
            &times;
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t("name")}</p>
              <p className="mt-0.5 text-foreground">{message.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t("date")}</p>
              <p className="mt-0.5 text-foreground">
                {new Date(message.createdAt).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t("email")}</p>
              <p className="mt-0.5 break-all text-foreground">{message.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t("phone")}</p>
              <p className="mt-0.5 text-foreground">{message.phone || "—"}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t("status")}</p>
            <p className="mt-0.5">
              {message.read ? (
                <span className="inline-block rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">
                  {t("read")}
                </span>
              ) : (
                <span className="inline-block rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700">
                  {t("new")}
                </span>
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t("message")}</p>
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
            {t("close")}
          </button>
          {!message.read && (
            <button
              onClick={() => { onMarkRead(message.id); onClose(); }}
              className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
            >
              {t("markAsRead")}
            </button>
          )}
          <button
            onClick={() => {
              if (confirm(t("confirmDelete"))) {
                onDelete(message.id);
                onClose();
              }
            }}
            className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            {t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
