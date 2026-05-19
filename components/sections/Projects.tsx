import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import ProjectCard from "./ProjectCard";

async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function Projects() {
  const projects = await getProjects();

  if (projects.length === 0) {
    return (
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">Our Projects</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Showcasing our finest work across residential, commercial, and industrial sectors
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 rounded-t-xl" />
                <div className="p-6">
                  <Skeleton className="h-5 w-1/4 mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">Our Projects</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Showcasing our finest work across residential, commercial, and industrial sectors
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
