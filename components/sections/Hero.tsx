"use client";

import { motion, useReducedMotion } from "motion/react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useSettings } from "@/lib/SettingsContext";

export default function Hero() {
  const s = useSettings();
  const prefersReducedMotion = useReducedMotion();
  const noAnim = prefersReducedMotion ? { initial: false } : {};
  const noAnimStagger = prefersReducedMotion ? { initial: false } : {};

  const tagline = s.company_tagline || "Building Your Vision With Excellence";
  const lastWith = tagline.lastIndexOf(" With ");
  const before = lastWith >= 0 ? tagline.slice(0, lastWith) : "";
  const after = lastWith >= 0 ? tagline.slice(lastWith + 1) : tagline;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0d0d0d]"
    >
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #a67c52 1px, transparent 1px),
            linear-gradient(-45deg, #a67c52 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="absolute top-1/4 right-[10%] w-72 h-72 border border-accent/10 rounded-full" />
      <div className="absolute bottom-1/4 left-[5%] w-96 h-96 border border-accent/5 rounded-full" />
      <div className="absolute top-1/3 left-1/3 w-px h-64 bg-gradient-to-b from-accent/20 to-transparent" />
      <div className="absolute top-1/2 right-1/4 w-px h-48 bg-gradient-to-b from-accent/10 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d0d0d] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            {...(!prefersReducedMotion ? { initial: { opacity: 0, y: 40 } } : {})}
            {...(!prefersReducedMotion ? { animate: { opacity: 1, y: 0 } } : {})}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 text-accent text-sm font-medium tracking-[0.2em] uppercase mb-6">
              <span className="w-8 h-px bg-accent" />
              {s.company_name || "BuildCo"}
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight text-balance">
              {before && (
                <>
                  {before}
                  <br />
                </>
              )}
              <span className="text-accent">{after}</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-white/60 max-w-xl leading-relaxed">
              {s.company_description ||
                "From concept to completion, we deliver exceptional construction projects that stand the test of time. Your trusted partner in building the future."}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button
                variant="accent"
                href="#contact"
                className="text-base px-8 py-4"
              >
                Start Your Project
              </Button>
              <Button
                variant="outline"
                href="#projects"
                className="text-base px-8 py-4 border-white/30 text-white hover:bg-white hover:text-[#0d0d0d]"
              >
                View Our Work
              </Button>
            </div>
          </motion.div>

          <motion.div
            {...(!prefersReducedMotion ? { initial: { opacity: 0, scale: 0.95 } } : {})}
            {...(!prefersReducedMotion ? { animate: { opacity: 1, scale: 1 } } : {})}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 border border-accent/20 rounded-3xl" />
              <div className="absolute inset-4 border border-accent/10 rounded-2xl" />
              <div className="absolute inset-8 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4">
                  {[Icon, Icon, Icon, Icon, Icon, Icon, Icon, Icon, Icon].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 flex items-center justify-center"
                    >
                      <Icon
                        name={
                          [
                            "hardhat",
                            "blueprint",
                            "building",
                            "crane",
                            "ruler",
                            "pillar",
                            "compass",
                            "hammer",
                            "toolbox",
                          ][i] as any
                        }
                        size={28}
                        className="text-accent/30"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-3 -right-3 w-24 h-24 flex items-center justify-center bg-accent rounded-2xl">
                <Icon name="hardhat" size={36} className="text-white" />
              </div>

              <div className="absolute -top-4 -left-4 w-16 h-16 border border-accent/30 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-accent rounded-full" />
              </div>
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
        <a href="#services" aria-label="Scroll down" className="flex flex-col items-center gap-2 text-white/30 hover:text-accent transition-colors">
          <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
          <svg className="w-4 h-4 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
