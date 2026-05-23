"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
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
  const prefersReducedMotion = useReducedMotion();

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
        className={`overflow-hidden group cursor-pointer border-sand hover:border-accent/40 transition-all duration-300 ${
          featured ? "lg:flex" : ""
        }`}
        onClick={() => images.length > 0 && openLightbox(0)}
      >
        <motion.div
          className={`relative overflow-hidden ${
            featured ? "lg:w-1/2 h-64 lg:h-auto" : "h-48"
          } bg-sand`}
          initial={prefersReducedMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
          whileInView={prefersReducedMotion ? undefined : { clipPath: "inset(0 0 0 0)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {images.length > 0 ? (
            <>
              <motion.img
                src={images[0]}
                alt={project.title}
                width={800}
                height={600}
                loading="lazy"
                className="w-full h-full object-cover"
                whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-primary/80 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                  <Icon name="crane" size={12} className="text-accent" />
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
            <motion.span
              className="absolute top-3 left-3 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
              initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              {project.category}
            </motion.span>
          )}

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center backdrop-blur-sm shadow-lg"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Icon name="arrowRight" size={18} className="text-white" />
            </motion.div>
          </motion.div>
        </motion.div>
        <div className={featured ? "lg:w-1/2 p-8 flex flex-col justify-center min-w-0 bg-surface" : "p-6 min-w-0 bg-surface"}>
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
