"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import MessageDetailModal from "@/components/admin/MessageDetailModal";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .finally(() => setLoading(false));
  }, []);

  async function markRead(id: string) {
    await fetch(`/api/contact/${id}`, { method: "PATCH" });
    setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
  }

  async function handleDelete(id: string) {
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    setMessages(messages.filter((m) => m.id !== id));
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-primary mb-8">Messages</h1>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone", render: (v: unknown) => v ? String(v) : "—" },
    { key: "message", label: "Message", render: (v: unknown) => <span className="line-clamp-1">{String(v)}</span> },
    {
      key: "read",
      label: "Status",
      render: (v: unknown) => v ? <span className="text-green-600 text-xs font-semibold">Read</span> : <span className="text-accent text-xs font-semibold">New</span>,
    },
    { key: "createdAt", label: "Date", render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-8">Messages</h1>
      {messages.length === 0 ? (
        <EmptyState title="No messages yet" description="Contact form submissions will appear here." />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={messages}
            onView={(id) => setSelectedMessage(messages.find((m) => m.id === id) || null)}
            onDelete={(id) => { if (confirm("Delete this message?")) handleDelete(id); }}
            onRowClick={(id) => setSelectedMessage(messages.find((m) => m.id === id) || null)}
          />
          {selectedMessage && (
            <MessageDetailModal
              message={selectedMessage}
              onClose={() => setSelectedMessage(null)}
              onMarkRead={markRead}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  );
}
