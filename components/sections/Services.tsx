"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import Icon from "@/components/ui/Icon";
import EmptyState from "@/components/ui/EmptyState";

const iconMap: Record<string, any> = {
  Building: "building",
  Home: "home",
  Road: "road",
  Bridge: "bridge",
  Renovation: "renovation",
  Design: "design",
  Consulting: "consulting",
  Interior: "interior",
  Electrical: "electrical",
  Plumbing: "plumbing",
};

interface Service {
  id: string;
  title: string;
  description: string;
  titleAr: string;
  descriptionAr: string;
  icon: string;
  order: number;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("services");
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="services" className="py-24 bg-sand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl text-heading">{t("heading")}</h2>
            <p className="mt-4 text-muted max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
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

  if (services.length === 0) {
    return (
      <section id="services" className="py-24 bg-sand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-24 bg-sand-light">
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
            {t("heading")}
          </h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group p-8 text-center hover:border-accent hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                  <Icon
                    name={iconMap[service.icon] || "hardhat"}
                    size={24}
                    className="text-accent group-hover:text-white transition-colors"
                  />
                </div>
                <h3 className="text-lg font-semibold text-heading mb-3">
                  {locale === "ar" && service.titleAr ? service.titleAr : service.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {locale === "ar" && service.descriptionAr ? service.descriptionAr : service.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
