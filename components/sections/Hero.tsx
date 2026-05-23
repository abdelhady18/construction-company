"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useSettings } from "@/lib/SettingsContext";

function WordReveal({ text, className, accent = false, delay = 0 }: { text: string; className?: string; accent?: boolean; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className={`inline-block animate-word-in ${accent ? "text-accent" : ""}`}
          style={{ opacity: 0, animationDelay: `${delay + i * 0.12}s` }}
        >
          {word}
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

const particles = [
  { className: "top-[15%] left-[8%] w-2 h-2 bg-accent/30 rounded-full", delay: "0s", duration: "4s" },
  { className: "top-[30%] right-[12%] w-1.5 h-1.5 bg-accent/20 rounded-full", delay: "1.2s", duration: "5s" },
  { className: "bottom-[25%] left-[15%] w-2.5 h-2.5 bg-accent/20 rounded-full", delay: "0.6s", duration: "4.5s" },
];

const iconNames = ["hardhat", "blueprint", "building", "crane", "ruler", "pillar", "compass", "hammer", "toolbox"] as const;

export default function Hero() {
  const s = useSettings();
  const t = useTranslations("hero");
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();

  const tagline = locale === "ar" && s.company_tagline_ar ? s.company_tagline_ar : s.company_tagline || "Building Your Vision With Excellence";
  const splitter = " With ";
  const lastWith = tagline.lastIndexOf(splitter);
  const before = lastWith >= 0 ? tagline.slice(0, lastWith) : "";
  const after = lastWith >= 0 ? tagline.slice(lastWith + splitter.length) : tagline;

  const companyName = locale === "ar" && s.company_name_ar ? s.company_name_ar : s.company_name || "Abu Suhaib Construction";

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f1b2d 0%, #1b2a4a 50%, #0f1b2d 100%)"
      }}
    >
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #c8a758 1px, transparent 1px),
            linear-gradient(-45deg, #c8a758 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {particles.map((p, i) => (
        <div
          key={i}
          className={`absolute ${p.className} animate-pulse-soft`}
          style={{ animationDelay: p.delay, animationDuration: p.duration }}
        />
      ))}

      <div className="absolute top-1/4 right-[10%] w-80 h-80 border border-accent/10 rounded-full animate-spin-slower" style={{ transformOrigin: "center" }} />
      <div className="absolute bottom-1/4 left-[5%] w-96 h-96 bg-accent/[0.02] rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/3 w-px h-64 bg-gradient-to-b from-accent/30 to-transparent" />
      <div className="absolute top-1/2 right-1/4 w-px h-48 bg-gradient-to-b from-accent/20 to-transparent" />

      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/[0.02] to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f1b2d] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            {...(!prefersReducedMotion ? { initial: { opacity: 0, y: 40 } } : {})}
            {...(!prefersReducedMotion ? { animate: { opacity: 1, y: 0 } } : {})}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 text-accent text-sm font-medium tracking-[0.2em] uppercase mb-6">
              <span className="w-8 h-px bg-accent" />
              {companyName}
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight text-balance">
              {before ? (
                <>
                  <WordReveal text={before} delay={0.2} />
                  <br />
                  <WordReveal text={after} delay={0.6} accent />
                </>
              ) : (
                <WordReveal text={tagline} delay={0.2} accent={locale !== "ar"} />
              )}
            </h1>
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-base sm:text-lg text-white/60 max-w-xl leading-relaxed"
            >
              {locale === "ar" && s.company_description_ar ? s.company_description_ar : s.company_description ||
                "From concept to completion, we deliver exceptional construction projects that stand the test of time. Your trusted partner in building the future."}
            </motion.p>
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Button
                variant="accent"
                href="#contact"
                className="text-base px-8 py-4 shadow-lg shadow-accent/20"
              >
                {t("startProject")}
              </Button>
              <Button
                variant="outline"
                href="#projects"
                className="text-base px-8 py-4 border-white/30 text-white hover:bg-white hover:text-primary"
              >
                {t("viewWork")}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            {...(!prefersReducedMotion ? { initial: { opacity: 0, scale: 0.95 } } : {})}
            {...(!prefersReducedMotion ? { animate: { opacity: 1, scale: 1 } } : {})}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-square">
              <motion.div
                className="absolute inset-0 border border-accent/20 rounded-3xl"
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.div
                className="absolute inset-4 border border-accent/10 rounded-2xl"
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="absolute inset-8 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4">
                  {iconNames.map((name) => (
                    <div key={name} className="w-10 h-10 flex items-center justify-center">
                      <Icon name={name} size={28} className="text-accent/30" />
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                className="absolute -bottom-3 -right-3 w-24 h-24 flex items-center justify-center bg-accent rounded-2xl shadow-lg shadow-accent/30"
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.5, rotate: -20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Icon name="hardhat" size={36} className="text-white" />
              </motion.div>

              <motion.div
                className="absolute -top-4 -left-4 w-16 h-16 border border-accent/30 rounded-full flex items-center justify-center"
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.5 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="w-3 h-3 bg-accent rounded-full shadow-sm shadow-accent/50"
                  animate={prefersReducedMotion ? undefined : { scale: [1, 1.3, 1] }}
                  transition={{ delay: 2, duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        {...(!prefersReducedMotion ? { initial: { opacity: 0 } } : {})}
        {...(!prefersReducedMotion ? { animate: { opacity: 1 } } : {})}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.a
          href="#services"
          aria-label={t("scrollAria")}
          className="flex flex-col items-center gap-2 text-white/30 hover:text-accent transition-colors"
          animate={prefersReducedMotion ? undefined : { y: [0, 4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px] tracking-[0.2em] uppercase">{t("scroll")}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.a>
      </motion.div>
    </section>
  );
}
