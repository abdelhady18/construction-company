"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useSettings } from "@/lib/SettingsContext";
import { formatHoursDisplay } from "@/components/ui/BusinessHoursPicker";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const settings = useSettings();
  const t = useTranslations("contact");
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
        }),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #0f1b2d 0%, #1b2a4a 100%)" }}>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #c8a758 1px, transparent 1px),
            linear-gradient(-45deg, #c8a758 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h2 className="font-serif text-4xl sm:text-5xl text-white mt-3 text-balance">
            {locale === "ar" && settings.contact_title_ar ? settings.contact_title_ar : settings.contact_title || "Contact Us"}
          </h2>
          <p className="mt-4 text-white/50 max-w-2xl mx-auto">
            {locale === "ar" && settings.contact_subtitle_ar ? settings.contact_subtitle_ar : settings.contact_subtitle || "Ready to start your project? Get in touch with us today"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label={t("form.nameLabel")}
                    name="name"
                    required
                    placeholder={t("form.namePlaceholder")}
                    className="[&_input]:bg-white/5 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/30 [&_input]:focus:border-accent [&_label]:text-white/80"
                  />
                  <Input
                    label={t("form.emailLabel")}
                    name="email"
                    type="email"
                    required
                    placeholder={t("form.emailPlaceholder")}
                    className="[&_input]:bg-white/5 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/30 [&_input]:focus:border-accent [&_label]:text-white/80"
                  />
                </div>
                <Input
                  label={t("form.phoneLabel")}
                  name="phone"
                  type="tel"
                  placeholder={t("form.phonePlaceholder")}
                  className="[&_input]:bg-white/5 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/30 [&_input]:focus:border-accent [&_label]:text-white/80"
                />
                <Input
                  label={t("form.messageLabel")}
                  name="message"
                  type="textarea"
                  required
                  placeholder={t("form.messagePlaceholder")}
                  className="[&_textarea]:bg-white/5 [&_textarea]:border-white/20 [&_textarea]:text-white [&_textarea]:placeholder:text-white/30 [&_textarea]:focus:border-accent [&_label]:text-white/80"
                />

                <Button
                  type="submit"
                  variant="accent"
                  className="w-full shadow-lg shadow-accent/20"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? t("form.sending") : t("form.submit")}
                </Button>

                {status === "success" && (
                  <p className="text-green-400 text-sm text-center">
                    {t("form.success")}
                  </p>
                )}
                {status === "error" && (
                  <p className="text-red-400 text-sm text-center">
                    {t("form.error")}
                  </p>
                )}
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-2xl text-white mb-6">{t("info.heading")}</h3>
                <div className="space-y-5">
                  {settings.contact_address && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Icon name="location" size={16} className="text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{t("info.address")}</p>
                        <p className="text-white/50 text-sm mt-0.5">
                          {locale === "ar" && settings.contact_address_ar ? settings.contact_address_ar : settings.contact_address}
                        </p>
                      </div>
                    </div>
                  )}
                  {settings.contact_phone && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Icon name="phone" size={16} className="text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{t("info.phone")}</p>
                        <p className="text-white/50 text-sm mt-0.5">{settings.contact_phone}</p>
                      </div>
                    </div>
                  )}
                  {settings.contact_email && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Icon name="mail" size={16} className="text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{t("info.email")}</p>
                        <p className="text-white/50 text-sm mt-0.5">{settings.contact_email}</p>
                      </div>
                    </div>
                  )}
                  {settings.contact_hours && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Icon name="clock" size={16} className="text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{t("info.hours")}</p>
                        <p className="text-white/50 text-sm mt-0.5">{formatHoursDisplay(settings.contact_hours, locale)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
                <h3 className="font-semibold text-white mb-2">{t("consultation.heading")}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {t("consultation.text")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
