"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/lib/content";

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

const WORD_STAGGER = 0.045;
const WORD_DELAY = 0.05;

const headlineContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: WORD_STAGGER, delayChildren: WORD_DELAY },
  },
};

const wordReveal = {
  hidden: { y: "100%" },
  show: {
    y: "0%",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const paragraphContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.75 },
  },
};

const lineReveal = {
  hidden: { y: "100%" },
  show: {
    y: "0%",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardsRow = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 1.2 },
  },
};

const cardItem = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const iconPop = {
  hidden: { scale: 0, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 380, damping: 14 },
  },
};

const cardText = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

function PinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-brand-red">
      <path
        d="M12 21S4.5 14.6 4.5 9.5a7.5 7.5 0 1115 0C19.5 14.6 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-brand-red">
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 9.5H20.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 3V6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16 3V6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function HeroSection() {
  const { lang } = useLanguage();
  const t = content.hero[lang];
  const bar = content.eventBar[lang];

  return (
    <section id="hero" className="relative flex min-h-screen flex-col bg-paper px-6 md:px-16">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-start justify-center gap-6 pt-20 pb-16 md:pt-24 md:pb-16"
      >
        <motion.span
          variants={fadeUp}
          className="text-sm font-semibold tracking-[0.2em] text-brand-red uppercase"
        >
          {t.eyebrow}
        </motion.span>

        <motion.h1
          variants={headlineContainer}
          className="relative max-w-none text-2xl leading-tight font-medium text-ink sm:text-3xl lg:text-4xl"
        >
          {t.headline.split(" ").map((word, i, arr) => (
            <span key={i}>
              <span className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span variants={wordReveal} className="inline-block">
                  {word}
                </motion.span>
              </span>
              {i < arr.length - 1 ? " " : ""}
            </span>
          ))}
          <motion.span
            variants={{
              hidden: { scaleX: 0 },
              show: {
                scaleX: 1,
                transition: {
                  duration: 0.7,
                  ease: [0.65, 0, 0.35, 1] as const,
                  delay: WORD_DELAY + t.headline.split(" ").length * WORD_STAGGER + 0.1,
                },
              },
            }}
            className="mt-2 block h-[3px] w-20 origin-left bg-brand-red rtl:origin-right"
          />
        </motion.h1>

        <motion.p
          variants={paragraphContainer}
          className="max-w-none text-lg leading-loose text-ink/70 md:text-xl [text-align:justify]"
        >
          <span className="block overflow-hidden pb-0.5">
            <motion.span variants={lineReveal} className="block">
              {t.subheadline}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-0.5">
            <motion.span variants={lineReveal} className="block">
              {t.body}
            </motion.span>
          </span>
        </motion.p>

        <motion.div variants={cardsRow} className="mt-2 flex w-full max-w-4xl flex-wrap gap-4">
          <motion.div
            variants={cardItem}
            className="flex min-w-[220px] flex-1 items-center gap-3.5 rounded-2xl border border-ink/10 bg-paper px-5 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
          >
            <motion.span
              variants={iconPop}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-red/10"
            >
              <PinIcon />
            </motion.span>
            <motion.div variants={cardText} className="flex flex-col whitespace-nowrap">
              <span className="text-[11px] font-semibold tracking-[0.15em] text-ink/40 uppercase">
                {bar.venueLabel}
              </span>
              <span className="text-lg font-bold text-ink">{bar.venueValue}</span>
            </motion.div>
          </motion.div>

          <motion.div
            variants={cardItem}
            className="flex min-w-[220px] flex-1 items-center gap-3.5 rounded-2xl border border-ink/10 bg-paper px-5 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
          >
            <motion.span
              variants={iconPop}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-red/10"
            >
              <CalendarIcon />
            </motion.span>
            <motion.div variants={cardText} className="flex flex-col whitespace-nowrap">
              <span className="text-[11px] font-semibold tracking-[0.15em] text-ink/40 uppercase">
                {bar.dateLabel}
              </span>
              <span className="text-lg font-bold text-ink">{bar.dateValue}</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
