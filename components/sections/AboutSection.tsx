"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";

function YearsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-brand-red">
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-brand-red">
      <circle cx="9" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19c1-3.2 3.3-4.7 5.5-4.7s4.5 1.5 5.5 4.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 8.7a3 3 0 010 5.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16.5 14.3c1.9.4 3.3 1.8 4 4.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-brand-red">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12L15 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const statIcons = [YearsIcon, PeopleIcon, ClockIcon];

const TICK_COUNT = 10;
const TICK_MS = 45;

function RollingValue({ value, active }: { value: string; active: boolean }) {
  const digitPositions = [...value].map((c) => /[0-9]/.test(c));
  const [display, setDisplay] = useState(() =>
    [...value].map((c, i) => (digitPositions[i] ? "0" : c)).join("")
  );

  useEffect(() => {
    if (!active) return;

    let tick = 0;
    const id = setInterval(() => {
      tick++;
      const chars = [...value].map((c, i) => {
        if (!digitPositions[i]) return c;
        return tick < TICK_COUNT ? String(Math.floor(Math.random() * 10)) : c;
      });
      setDisplay(chars.join(""));
      if (tick >= TICK_COUNT) clearInterval(id);
    }, TICK_MS);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return <span dir="ltr">{display}</span>;
}

export default function AboutSection() {
  const { lang } = useLanguage();
  const t = content.about[lang];

  const stats = [
    { value: t.stat1Value, label: t.stat1Label },
    { value: t.stat2Value, label: t.stat2Label },
    { value: t.stat3Value, label: t.stat3Label },
  ];

  const rowRef = useRef(null);
  const inView = useInView(rowRef, { once: true, amount: 0.4 });

  return (
    <section id="about" className="bg-paper px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto flex max-w-5xl flex-col gap-16">
        <SectionHeading
          title={t.title}
          body={t.body}
          noWrapTitle
          bodyClassName="max-w-none text-lg leading-loose text-ink/60 md:text-xl [text-align:justify]"
        />

        <div ref={rowRef} className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((s, i) => {
            const Icon = statIcons[i];
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                className="flex flex-col gap-3"
              >
                <Icon />
                <span className="text-4xl font-extrabold text-brand-red tabular-nums md:text-5xl">
                  <RollingValue value={s.value} active={inView} />
                </span>
                <span className="text-sm text-ink/60 md:text-base">{s.label}</span>
                <span className="h-[3px] w-full overflow-hidden rounded-full bg-ink/8">
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                    className="block h-full w-full origin-right bg-brand-red ltr:origin-left"
                  />
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
