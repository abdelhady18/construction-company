"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface ContactSettings {
  contact_title?: string;
  contact_subtitle?: string;
  contact_address?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_hours?: string;
}

export default function Contact({ settings }: { settings?: ContactSettings }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const s = settings || {};

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
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">{s.contact_title || "Contact Us"}</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {s.contact_subtitle || "Ready to start your project? Get in touch with us today"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input label="Full Name" name="name" required placeholder="John Doe" />
              <Input label="Email" name="email" type="email" required placeholder="john@example.com" />
              <Input label="Phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
              <Input label="Message" name="message" type="textarea" required placeholder="Tell us about your project..." />

              <Button type="submit" variant="primary" className="w-full" disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Send Message"}
              </Button>

              {status === "success" && (
                <p className="text-green-600 text-sm text-center">Message sent successfully! We&apos;ll get back to you soon.</p>
              )}
              {status === "error" && (
                <p className="text-red-600 text-sm text-center">Failed to send message. Please try again.</p>
              )}
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Get In Touch</h3>
              <div className="space-y-4 text-gray-600">
                {s.contact_address && (
                  <div className="flex items-start gap-3">
                    <span className="text-xl">📍</span>
                    <div>
                      <p className="font-medium">Address</p>
                      <p>{s.contact_address}</p>
                    </div>
                  </div>
                )}
                {s.contact_phone && (
                  <div className="flex items-start gap-3">
                    <span className="text-xl">📞</span>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p>{s.contact_phone}</p>
                    </div>
                  </div>
                )}
                {s.contact_email && (
                  <div className="flex items-start gap-3">
                    <span className="text-xl">✉️</span>
                    <div>
                      <p className="font-medium">Email</p>
                      <p>{s.contact_email}</p>
                    </div>
                  </div>
                )}
                {s.contact_hours && (
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🕐</span>
                    <div>
                      <p className="font-medium">Hours</p>
                      <p>{s.contact_hours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-surface rounded-xl p-6">
              <h3 className="text-lg font-semibold text-primary mb-2">Free Consultation</h3>
              <p className="text-gray-600 text-sm">
                Schedule a free consultation with our team. We&apos;ll discuss your
                project requirements and provide a detailed estimate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
