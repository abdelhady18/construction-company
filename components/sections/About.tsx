"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";

export default function About() {
  const [s, setS] = useState<Record<string, string>>({});
  const [team, setTeam] = useState<{ id: string; name: string; role: string; imageUrl: string | null }[]>([]);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setS(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => setTeam(data))
      .catch(() => {});
  }, []);

  const defaultStats = [
    { value: "15+", label: "Years Experience" },
    { value: "200+", label: "Projects Completed" },
    { value: "50+", label: "Expert Team" },
    { value: "98%", label: "Client Satisfaction" },
  ];

  let stats = defaultStats;
  if (s.about_stats) {
    try {
      const parsed = JSON.parse(s.about_stats);
      if (Array.isArray(parsed) && parsed.length > 0) {
        stats = parsed;
      }
    } catch {}
  }

  return (
    <section id="about" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
            Who We Are
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-heading mt-3">
            {s.about_title || "About Us"}
          </h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto">
            {s.about_subtitle || "Dedicated to delivering superior construction services since 2010"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
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
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
              Our Story
            </span>
            <h3 className="font-serif text-3xl text-heading mt-3 mb-6">
              Built on a Foundation of Trust
            </h3>
            <p className="text-muted leading-relaxed mb-4">
              {s.about_story ||
                "Founded in 2010, BuildCo has grown from a small local contractor to one of the region's most trusted construction companies. We pride ourselves on quality craftsmanship, innovative solutions, and unwavering commitment to client satisfaction."}
            </p>
            <p className="text-muted leading-relaxed">
              {s.about_story_2 ||
                "Every project we undertake is a partnership. We listen, plan, and execute with precision, ensuring your vision becomes reality. Our team of experts brings decades of combined experience to every job."}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative p-6 text-center border border-border rounded-xl bg-surface"
            >
              <div className="text-3xl font-serif text-accent">{stat.value}</div>
              <div className="text-sm text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="font-serif text-3xl text-heading">Meet Our Team</h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => {
              const initials = member.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="group relative p-6 text-center border border-border rounded-xl bg-surface hover:border-accent/30 transition-colors duration-300">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                        <span className="text-lg font-semibold text-accent">{initials}</span>
                      </div>
                    )}
                    <h4 className="font-semibold text-heading">{member.name}</h4>
                    <p className="text-sm text-muted mt-1">{member.role}</p>
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
