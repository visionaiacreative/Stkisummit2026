"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/lib/content";

const RING_SIZE = 140;
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_FRACTION = 0.28;

function TimerRing({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
      <motion.div
        className="absolute inset-0 rounded-full bg-brand-red/10 blur-xl"
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.svg
        width={RING_SIZE}
        height={RING_SIZE}
        viewBox="0 0 120 120"
        className="absolute inset-0"
        style={{ transformOrigin: "70px 70px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="60" cy="60" r={RADIUS} strokeWidth="8" fill="none" className="stroke-ink/10" />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          className="stroke-brand-red"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - ARC_FRACTION)}
        />
      </motion.svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-ink">{value}</span>
        <span className="text-[10px] font-semibold tracking-[0.2em] text-ink/40 uppercase">
          {unit}
        </span>
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-brand-red">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12L15 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-brand-red">
      <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 19c1.2-3.5 4-5 7-5s5.8 1.5 7 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-brand-red">
      <path
        d="M12 4l1.6 4.9L18.5 10.5 13.6 12.1 12 17 10.4 12.1 5.5 10.5 10.4 8.9 12 4z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const bulletIcons = [ClockIcon, PersonIcon, SparkleIcon];

export default function TechTalkSection() {
  const { lang } = useLanguage();
  const t = content.techTalk[lang];

  return (
    <section id="tech-talk" className="bg-paper px-6 py-24 md:px-16 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-brand-red/15 bg-gradient-to-br from-brand-red/[0.06] via-paper to-paper-soft p-8 md:p-14"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -end-24 h-64 w-64 rounded-full bg-brand-red/10 blur-3xl"
        />

        <div className="relative flex flex-col items-center gap-10 text-center md:flex-row md:items-center md:gap-14 md:text-start">
          <TimerRing value="7" unit={t.unit} />

          <div className="flex flex-col items-center gap-4 md:items-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-1.5 text-xs font-semibold tracking-wide text-white uppercase">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-white"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
              {t.badge}
            </span>

            <h2 className="text-4xl font-extrabold text-ink md:text-6xl">{t.title}</h2>

            <p className="max-w-md text-lg leading-relaxed text-ink/60 md:text-xl [text-align:justify]">
              {t.body}
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-2 md:justify-start">
              {t.bullets.map((bullet, i) => {
                const Icon = bulletIcons[i];
                return (
                  <motion.span
                    key={bullet}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: "easeOut" }}
                    className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-ink/10 bg-paper px-4 py-2 text-sm font-medium text-ink/70 shadow-sm transition-transform hover:-translate-y-0.5 hover:border-brand-red/40"
                  >
                    <Icon />
                    {bullet}
                  </motion.span>
                );
              })}
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/videos/techtalk-loop.webp"
            alt=""
            className="w-[130px] shrink-0 drop-shadow-lg md:w-[150px] lg:w-[170px]"
            style={{ aspectRatio: "320 / 522" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
