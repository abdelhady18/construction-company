"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/admin/DataTable";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
  order: number;
}

export default function TeamPage() {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this team member?")) return;
    await fetch(`/api/team/${id}`, { method: "DELETE" });
    setMembers(members.filter((m) => m.id !== id));
  }

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-heading">Team</h1>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const columns = [
    {
      key: "imageUrl",
      label: "Photo",
      render: (_v: unknown, row: Record<string, unknown>) => {
        const member = row as unknown as TeamMember;
        const initials = member.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        return member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={member.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-accent">{initials}</span>
          </div>
        );
      },
    },
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "order", label: "Order" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-heading">Team</h1>
        <Button variant="primary" href="/admin/team/new">
          Add Member
        </Button>
      </div>
      {members.length === 0 ? (
        <EmptyState
          title="No team members yet"
          description="Add your first team member to display on the website."
          action={
            <Button variant="primary" href="/admin/team/new">
              Add Member
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={members}
          onView={(id) => router.push(`/admin/team/${id}`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
