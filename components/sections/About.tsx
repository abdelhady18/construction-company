"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import { useSettings } from "@/lib/SettingsContext";

export default function About() {
  const s = useSettings();
  const t = useTranslations("about");
  const locale = useLocale();
  const [team, setTeam] = useState<{ id: string; name: string; role: string; nameAr: string; roleAr: string; imageUrl: string | null }[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/team", { signal: ac.signal })
      .then((r) => r.json())
      .then((data) => setTeam(data))
      .catch(() => {});
    return () => ac.abort();
  }, []);

  const defaultStats = [
    { value: "15+", label: t("stats.years") },
    { value: "200+", label: t("stats.projects") },
    { value: "50+", label: t("stats.team") },
    { value: "98%", label: t("stats.satisfaction") },
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
    <section id="about" className="py-24 bg-background">
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
            {locale === "ar" && s.about_subtitle_ar ? s.about_subtitle_ar : s.about_subtitle || "Dedicated to delivering superior construction services since 2010"}
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
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#0d0d0d] border border-border relative">
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #a67c52 1px, transparent 1px),
                    linear-gradient(-45deg, #a67c52 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon name="building" size={80} className="text-accent/20" />
              </div>
              <div className="absolute top-4 left-4 w-20 h-20 border border-accent/20 rounded-lg" />
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
                "Founded in 2010, BuildCo has grown from a small local contractor to one of the region's most trusted construction companies. We pride ourselves on quality craftsmanship, innovative solutions, and unwavering commitment to client satisfaction."}
            </p>
            <p className="text-muted leading-relaxed">
              {locale === "ar" && s.about_story_2_ar ? s.about_story_2_ar : s.about_story_2 ||
                "Every project we undertake is a partnership. We listen, plan, and execute with precision, ensuring your vision becomes reality. Our team of experts brings decades of combined experience to every job."}
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
            <div
              key={stat.label}
              className="relative p-6 text-center border border-border rounded-xl bg-surface"
            >
              <div className="text-3xl font-serif text-accent tabular-nums">{stat.value}</div>
              <div className="text-sm text-muted mt-1">{stat.label}</div>
            </div>
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
            {team.map((member, index) => {
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
                  <div className="group relative p-6 text-center border border-border rounded-xl bg-surface hover:border-accent/30 transition-colors duration-300">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={displayName}
                        width={64}
                        height={64}
                        loading="lazy"
                        className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                        <span className="text-lg font-semibold text-accent">{initials}</span>
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
