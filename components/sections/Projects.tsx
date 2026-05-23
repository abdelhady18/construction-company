"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import ProjectCard from "./ProjectCard";

interface Project {
  id: string;
  title: string;
  description: string;
  images: string;
  category: string | null;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl text-heading">Our Projects</h2>
            <p className="mt-4 text-muted max-w-2xl mx-auto">
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

  if (projects.length === 0) {
    return (
      <section id="projects" className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState title="No projects yet" description="Projects will appear here once added." />
        </div>
      </section>
    );
  }

  const [featured, ...rest] = projects;

  return (
    <section id="projects" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
            Our Portfolio
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-heading mt-3 text-balance">
            Featured Projects
          </h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto">
            Showcasing our finest work across residential, commercial, and industrial sectors
          </p>
        </motion.div>

        {featured && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="lg:col-span-2">
              <ProjectCard project={featured} featured />
            </div>
          </motion.div>
        )}

        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((project, index) => (
              <motion.div
                key={project.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
