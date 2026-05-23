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
  nameAr: string;
  roleAr: string;
  imageUrl: string | null;
  order: number;
}

export default function TeamPage() {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/team", { signal: ac.signal })
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ac.abort();
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
      label: lang === "ar" ? "الصورة" : "Photo",
      render: (_v: unknown, row: Record<string, unknown>) => {
        const member = row as unknown as TeamMember;
        const displayName = lang === "ar" && member.nameAr ? member.nameAr : member.name;
        const initials = displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        return member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-accent">{initials}</span>
          </div>
        );
      },
    },
    { key: "name", label: lang === "ar" ? "الاسم" : "Name", render: (_v: unknown, row: Record<string, unknown>) => lang === "ar" && row.nameAr ? String(row.nameAr) : String(row.name) },
    { key: "role", label: lang === "ar" ? "المسمى الوظيفي" : "Role", render: (_v: unknown, row: Record<string, unknown>) => lang === "ar" && row.roleAr ? String(row.roleAr) : String(row.role) },
    { key: "order", label: lang === "ar" ? "الترتيب" : "Order" },
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
        <>
          <div className="flex bg-border rounded-lg p-0.5 w-fit mb-4">
            <button type="button" onClick={() => setLang("en")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${lang === "en" ? "bg-accent text-white" : "text-muted hover:text-foreground"}`}>English</button>
            <button type="button" onClick={() => setLang("ar")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${lang === "ar" ? "bg-accent text-white" : "text-muted hover:text-foreground"}`}>العربية</button>
          </div>
          <DataTable
            columns={columns}
            data={members}
            onView={(id) => router.push(`/admin/team/${id}`)}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
}
