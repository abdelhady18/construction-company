"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import IconSelect from "@/components/ui/IconSelect";

const iconOptions = [
  { value: "Building", icon: "building" as const },
  { value: "Home", icon: "home" as const },
  { value: "Road", icon: "road" as const },
  { value: "Bridge", icon: "bridge" as const },
  { value: "Renovation", icon: "renovation" as const },
  { value: "Design", icon: "design" as const },
  { value: "Consulting", icon: "consulting" as const },
  { value: "Interior", icon: "interior" as const },
  { value: "Electrical", icon: "electrical" as const },
  { value: "Plumbing", icon: "plumbing" as const },
];

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    fetch(`/api/services/${id}`, { signal: ac.signal })
      .then((res) => res.json())
      .then((data) => setService(data));
    return () => ac.abort();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        icon: form.get("icon"),
        order: Number(form.get("order")),
      }),
    });

    if (res.ok) {
      router.push("/admin/services");
    }
    setSubmitting(false);
  }

  if (!service) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-heading mb-8">Edit Service</h1>
        <Skeleton className="h-96 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-8">Edit Service</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Input label="Title" name="title" required defaultValue={service.title} />
        <Input label="Description" name="description" type="textarea" required defaultValue={service.description} />
        <IconSelect
          label="Icon"
          name="icon"
          options={iconOptions}
          value={service.icon}
        />
        <Input label="Order" name="order" type="number" defaultValue={String(service.order)} />
        <div className="flex gap-4">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="ghost" href="/admin/services">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
