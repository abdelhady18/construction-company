"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useSettings } from "@/lib/SettingsContext";
import { formatHoursDisplay } from "@/components/ui/BusinessHoursPicker";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const settings = useSettings();
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
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#0d0d0d]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #a67c52 1px, transparent 1px),
            linear-gradient(-45deg, #a67c52 1px, transparent 1px)
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
            Get In Touch
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-white mt-3 text-balance">
            {settings.contact_title || "Contact Us"}
          </h2>
          <p className="mt-4 text-white/50 max-w-2xl mx-auto">
            {settings.contact_subtitle || "Ready to start your project? Get in touch with us today"}
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
                    label="Full Name"
                    name="name"
                    required
                    placeholder="John Doe"
                    className="[&_input]:bg-transparent [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/30 [&_input]:focus:border-accent [&_label]:text-white/80"
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="[&_input]:bg-transparent [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/30 [&_input]:focus:border-accent [&_label]:text-white/80"
                  />
                </div>
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="[&_input]:bg-transparent [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/30 [&_input]:focus:border-accent [&_label]:text-white/80"
                />
                <Input
                  label="Message"
                  name="message"
                  type="textarea"
                  required
                  placeholder="Tell us about your project..."
                  className="[&_textarea]:bg-transparent [&_textarea]:border-white/20 [&_textarea]:text-white [&_textarea]:placeholder:text-white/30 [&_textarea]:focus:border-accent [&_label]:text-white/80"
                />

                <Button
                  type="submit"
                  variant="accent"
                  className="w-full"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Sending…" : "Send Message"}
                </Button>

                {status === "success" && (
                  <p className="text-green-400 text-sm text-center">
                    Message sent successfully! We&apos;ll get back to you soon.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-red-400 text-sm text-center">
                    Failed to send message. Please try again.
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
                <h3 className="font-serif text-2xl text-white mb-6">Contact Info</h3>
                <div className="space-y-5">
                  {settings.contact_address && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Icon name="location" size={16} className="text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">Address</p>
                        <p className="text-white/50 text-sm mt-0.5">{settings.contact_address}</p>
                      </div>
                    </div>
                  )}
                  {settings.contact_phone && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Icon name="phone" size={16} className="text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">Phone</p>
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
                        <p className="font-medium text-white text-sm">Email</p>
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
                        <p className="font-medium text-white text-sm">Hours</p>
                        <p className="text-white/50 text-sm mt-0.5">{formatHoursDisplay(settings.contact_hours)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">Free Consultation</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  Schedule a free consultation with our team. We&apos;ll discuss your
                  project requirements and provide a detailed estimate.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
