"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/admin/DataTable";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

interface Project {
  id: string;
  title: string;
  category: string | null;
  featured: boolean;
  createdAt: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/projects", { signal: ac.signal })
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects(projects.filter((p) => p.id !== id));
  }

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-heading">Projects</h1>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const columns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category", render: (v: unknown) => v ? String(v) : "—" },
    { key: "featured", label: "Featured", render: (v: unknown) => v ? "✅" : "—" },
    { key: "createdAt", label: "Created", render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-heading">Projects</h1>
        <Button variant="primary" href="/admin/projects/new">Add Project</Button>
      </div>
      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Add your first project to showcase your work."
          action={<Button variant="primary" href="/admin/projects/new">Add Project</Button>}
        />
      ) : (
        <DataTable
          columns={columns}
          data={projects}
          onView={(id) => router.push(`/admin/projects/${id}`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
