"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";

const ImageLightbox = dynamic(() => import("@/components/ui/ImageLightbox"), { ssr: false });

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    titleAr: string;
    descriptionAr: string;
    images: string;
    category: string | null;
  };
  featured?: boolean;
}

export default function ProjectCard({ project, featured }: ProjectCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const locale = useLocale();

  const images: string[] = project.images ? JSON.parse(project.images) : [];

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
      <Card
        className={`overflow-hidden group cursor-pointer ${
          featured ? "lg:flex" : ""
        }`}
        onClick={() => images.length > 0 && openLightbox(0)}
      >
        <div
          className={`relative overflow-hidden ${
            featured ? "lg:w-1/2 h-64 lg:h-auto" : "h-48"
          } bg-border`}
        >
          {images.length > 0 ? (
            <>
              <img
                src={images[0]}
                alt={project.title}
                width={800}
                height={600}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Icon name="crane" size={12} className="text-white" />
                  <span>+{images.length - 1}</span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon name="building" size={40} className="text-muted/40" />
            </div>
          )}
          {project.category && (
            <span className="absolute top-3 left-3 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
              {project.category}
            </span>
          )}

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center backdrop-blur-sm">
              <Icon name="arrowRight" size={18} className="text-heading" />
            </div>
          </div>
        </div>
        <div className={featured ? "lg:w-1/2 p-8 flex flex-col justify-center min-w-0" : "p-6 min-w-0"}>
          <h3 className={`font-semibold text-heading mb-2 ${featured ? "text-2xl" : "text-lg"}`}>
            {locale === "ar" && project.titleAr ? project.titleAr : project.title}
          </h3>
          <p className={`text-muted leading-relaxed line-clamp-3 break-words ${featured ? "text-base" : "text-sm"}`}>
            {locale === "ar" && project.descriptionAr ? project.descriptionAr : project.description}
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
