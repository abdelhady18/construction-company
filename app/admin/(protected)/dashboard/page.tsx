import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/admin/StatsCard";
import Button from "@/components/ui/Button";

export default async function DashboardPage() {
  const [serviceCount, projectCount, messageCount, unreadCount] = await Promise.all([
    prisma.service.count(),
    prisma.project.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-heading">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Services" value={serviceCount} icon="🏗️" />
        <StatsCard title="Projects" value={projectCount} icon="🏗️" />
        <StatsCard title="Messages" value={messageCount} icon="✉️" />
        <StatsCard title="Unread" value={unreadCount} icon="📬" />
      </div>
      <div className="bg-surface rounded-xl p-6 border border-border">
        <h2 className="text-lg font-semibold text-heading mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" href="/admin/services/new">
            Add Service
          </Button>
          <Button variant="primary" href="/admin/projects/new">
            Add Project
          </Button>
          <Button variant="secondary" href="/admin/messages">
            View Messages
          </Button>
        </div>
      </div>
    </div>
  );
}
