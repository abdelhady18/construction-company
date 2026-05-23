"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useReducedMotion, useInView } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useCachedFetch } from "@/lib/api-cache";
import Icon from "@/components/ui/Icon";
import { useSettings } from "@/lib/SettingsContext";

function AnimatedStat({ value: raw, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState("0");
  const num = parseInt(raw, 10);
  const suffix = raw.replace(/[\d+]/g, "");
  const isNumeric = !isNaN(num);

  useEffect(() => {
    if (!inView || !isNumeric) return;
    let start: number | null = null;
    const duration = 1500;
    function step(ts: number) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(eased * num) + suffix);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [inView, num, suffix, isNumeric]);

  return (
    <div ref={ref} className="relative p-6 text-center bg-surface border border-sand rounded-xl shadow-sm">
      <div className="text-3xl font-serif text-accent-dark tabular-nums">{isNumeric ? displayed : raw}</div>
      <div className="text-sm text-muted mt-1">{label}</div>
    </div>
  );
}

export default function About() {
  const s = useSettings();
  const t = useTranslations("about");
  const locale = useLocale();
  const { data: team } = useCachedFetch<{ id: string; name: string; role: string; nameAr: string; roleAr: string; imageUrl: string | null }[]>("/api/team");
  const prefersReducedMotion = useReducedMotion();

  const defaultStats = [
    { value: "20+", label: t("stats.years") },
    { value: "50+", label: t("stats.projects") },
    { value: "15+", label: t("stats.team") },
    { value: "100%", label: t("stats.satisfaction") },
  ];

  let stats = defaultStats;
  const statsKey = locale === "ar" && s.about_stats_ar ? s.about_stats_ar : s.about_stats;
  if (statsKey) {
    try {
      const parsed = JSON.parse(statsKey);
      if (Array.isArray(parsed) && parsed.length > 0) {
        stats = parsed;
      }
    } catch {}
  }

  return (
    <section id="about" className="py-24 bg-sand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
            {t("badge")}
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-heading mt-3 text-balance">
            {locale === "ar" && s.about_title_ar ? s.about_title_ar : s.about_title || "About Us"}
          </h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto">
            {locale === "ar" && s.about_subtitle_ar ? s.about_subtitle_ar : s.about_subtitle || "Serving Bahrain with distinction since 2006"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-primary-light border border-accent/20 relative shadow-xl shadow-primary/10">
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #c8a758 1px, transparent 1px),
                    linear-gradient(-45deg, #c8a758 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon name="building" size={80} className="text-accent/20" />
              </div>
              <div className="absolute top-4 left-4 w-20 h-20 border border-accent/30 rounded-lg" />
              <div className="absolute bottom-4 right-4 w-16 h-16 bg-accent/10 rounded-lg" />
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
              {t("storyBadge")}
            </span>
            <h3 className="font-serif text-3xl text-heading mt-3 mb-6 text-balance">
              {t("storyHeading")}
            </h3>
            <p className="text-muted leading-relaxed mb-4">
              {locale === "ar" && s.about_story_ar ? s.about_story_ar : s.about_story ||
                "Founded in 2006 with our head office in the Kingdom of Bahrain, Abu Suhaib Construction has established itself as a trusted name in the construction industry. We carry out all types of construction, with particular expertise in luxury villas, residential developments, and commercial projects."}
            </p>
            <p className="text-muted leading-relaxed">
              {locale === "ar" && s.about_story_2_ar ? s.about_story_2_ar : s.about_story_2 ||
                "We specialize in design and build services, offering comprehensive solutions from concept to completion. Our integrated approach combines architectural vision with practical execution, while our landscape design services transform outdoor spaces into breathtaking environments."}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24"
        >
          {stats.map((stat) => (
            <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </motion.div>

        <div>
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="font-serif text-3xl text-heading text-balance">{t("teamHeading")}</h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team?.map((member, index) => {
              const displayName = locale === "ar" && member.nameAr ? member.nameAr : member.name;
              const displayRole = locale === "ar" && member.roleAr ? member.roleAr : member.role;
              const initials = displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
              return (
                <motion.div
                  key={member.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="group relative p-6 text-center bg-surface border border-sand rounded-xl hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={displayName}
                        width={64}
                        height={64}
                        loading="lazy"
                        className="w-16 h-16 rounded-full object-cover mx-auto mb-4 ring-2 ring-accent/20"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                        <span className="text-lg font-semibold text-accent group-hover:text-white transition-colors">{initials}</span>
                      </div>
                    )}
                    <h4 className="font-semibold text-heading">{displayName}</h4>
                    <p className="text-sm text-muted mt-1">{displayRole}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
