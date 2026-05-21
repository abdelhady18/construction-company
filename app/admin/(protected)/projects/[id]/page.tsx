"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import ImageUploader from "@/components/admin/ImageUploader";

interface Project {
  id: string;
  title: string;
  description: string;
  images: string;
  category: string | null;
  featured: boolean;
}

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        const p = data.find((x: Project) => x.id === id);
        setProject(p);
        if (p) setImages(JSON.parse(p.images));
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        category: form.get("category"),
        featured: form.get("featured") === "on",
        images,
      }),
    });

    if (res.ok) {
      router.push("/admin/projects");
    }
    setSubmitting(false);
  }

  if (!project) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-heading mb-8">Edit Project</h1>
        <Skeleton className="h-96 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-8">Edit Project</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Input label="Title" name="title" required defaultValue={project.title} />
        <Input label="Description" name="description" type="textarea" required defaultValue={project.description} />
        <Input label="Category" name="category" defaultValue={project.category || ""} />
        <ImageUploader images={images} onChange={setImages} />
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <input type="checkbox" name="featured" defaultChecked={project.featured} className="rounded" />
          Featured project
        </label>
        <div className="flex gap-4">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="ghost" href="/admin/projects">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
