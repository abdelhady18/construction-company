"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import ImageLightbox from "@/components/ui/ImageLightbox";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    images: string;
    category: string | null;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images: string[] = JSON.parse(project.images);

  function openLightbox(index: number) {
    setCurrentIndex(index);
    setLightboxOpen(true);
  }

  function handlePrev() {
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }

  function handleNext() {
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  return (
    <>
      <Card className="overflow-hidden group">
        <div
          className="h-48 bg-gray-200 relative overflow-hidden cursor-pointer"
          onClick={() => images.length > 0 && openLightbox(0)}
        >
          {images.length > 0 ? (
            <>
              <img
                src={images[0]}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span>📷</span>
                  <span>+{images.length - 1}</span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
              🏗️
            </div>
          )}
          {project.category && (
            <span className="absolute top-3 left-3 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
              {project.category}
            </span>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-primary mb-2">{project.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {project.description}
          </p>
        </div>
      </Card>

      {lightboxOpen && images.length > 0 && (
        <ImageLightbox
          images={images}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelect={setCurrentIndex}
        />
      )}
    </>
  );
}
