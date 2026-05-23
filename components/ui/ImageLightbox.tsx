"use client";

import { useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

export default function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onSelect,
}: ImageLightboxProps) {
  const t = useTranslations("imageLightbox");
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={t("galleryAria")}
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
      style={{ overscrollBehavior: 'contain' }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl z-10 cursor-pointer"
        aria-label={t("closeAria")}
      >
        ✕
      </button>

      <div
        className="relative w-full max-w-5xl max-h-[80vh] mx-4 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <button
            onClick={onPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition cursor-pointer z-10"
            aria-label={t("prevAria")}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <img
          src={images[currentIndex]}
          alt={t("imageAlt", { n: currentIndex + 1 })}
          className="max-h-[80vh] max-w-full object-contain rounded-lg"
        />

        {images.length > 1 && (
          <button
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition cursor-pointer z-10"
            aria-label={t("nextAria")}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`w-16 h-12 rounded-md overflow-hidden border-2 transition cursor-pointer ${
                i === currentIndex ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="mt-2 text-white/60 text-sm" onClick={(e) => e.stopPropagation()}>
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
