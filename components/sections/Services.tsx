import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";

const iconMap: Record<string, string> = {
  Building: "🏗️",
  Home: "🏠",
  Road: "🛣️",
  Bridge: "🌉",
  Renovation: "🔨",
  Design: "📐",
  Consulting: "📋",
  Interior: "🪑",
  Electrical: "⚡",
  Plumbing: "🔧",
};

async function getServices() {
  try {
    return await prisma.service.findMany({
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function Services() {
  const services = await getServices();

  if (services.length === 0) {
    return (
      <section id="services" className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">Our Services</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive construction solutions tailored to your needs
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-8">
                <Skeleton className="w-12 h-12 rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">Our Services</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive construction solutions tailored to your needs
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="p-8 group hover:-translate-y-1 transition-transform duration-300">
              <div className="text-4xl mb-4">{iconMap[service.icon] || "🏗️"}</div>
              <h3 className="text-xl font-semibold text-primary mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
