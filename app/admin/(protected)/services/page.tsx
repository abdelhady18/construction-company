"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/admin/DataTable";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

interface Service {
  id: string;
  title: string;
  description: string;
  titleAr: string;
  descriptionAr: string;
  icon: string;
  order: number;
  createdAt: string;
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/services", { signal: ac.signal })
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    setServices(services.filter((s) => s.id !== id));
  }

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-heading">Services</h1>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const iconMap: Record<string, any> = {
    Building: "building", Home: "home", Road: "road", Bridge: "bridge",
    Renovation: "renovation", Design: "design", Consulting: "consulting",
    Interior: "interior", Electrical: "electrical", Plumbing: "plumbing",
  };

  const columns = [
    { key: "icon", label: "Icon", render: (v: unknown) => (
      <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
        <Icon name={iconMap[String(v)] || "hardhat"} size={16} className="text-accent" />
      </div>
    ) },
    { key: "title", label: lang === "ar" ? "العنوان" : "Title", render: (_v: unknown, row: Record<string, unknown>) => lang === "ar" && row.titleAr ? String(row.titleAr) : String(row.title) },
    { key: "description", label: lang === "ar" ? "الوصف" : "Description", render: (_v: unknown, row: Record<string, unknown>) => <span className="line-clamp-2">{lang === "ar" && row.descriptionAr ? String(row.descriptionAr) : String(row.description)}</span> },
    { key: "order", label: lang === "ar" ? "الترتيب" : "Order" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-heading">Services</h1>
        <Button variant="primary" href="/admin/services/new">
          Add Service
        </Button>
      </div>
      {services.length === 0 ? (
        <EmptyState
          title="No services yet"
          description="Add your first service to display on the website."
          action={<Button variant="primary" href="/admin/services/new">Add Service</Button>}
        />
      ) : (
        <>
          <div className="flex bg-border rounded-lg p-0.5 w-fit mb-4">
            <button type="button" onClick={() => setLang("en")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${lang === "en" ? "bg-accent text-white" : "text-muted hover:text-foreground"}`}>English</button>
            <button type="button" onClick={() => setLang("ar")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${lang === "ar" ? "bg-accent text-white" : "text-muted hover:text-foreground"}`}>العربية</button>
          </div>
          <DataTable
            columns={columns}
            data={services}
            onView={(id) => router.push(`/admin/services/${id}`)}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
}
