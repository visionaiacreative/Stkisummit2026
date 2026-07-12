"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AudienceSection() {
  const { lang } = useLanguage();
  const t = content.audience[lang];
  const reduceMotion = useReducedMotion();

  return (
    <section id="audience" className="overflow-hidden bg-paper-soft py-24 md:py-32">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 md:px-16">
        <SectionHeading title={t.title} body={t.body} />
      </div>

      <div
        dir="ltr"
        className="relative mt-10 py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        <motion.div
          className="flex w-max gap-3"
          animate={reduceMotion ? undefined : { x: ["0%", "-25%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        >
          {[...t.sectors, ...t.sectors, ...t.sectors, ...t.sectors].map((sector, i) => (
            <span
              key={`${sector}-${i}`}
              className="shrink-0 rounded-full border border-ink/15 bg-paper px-5 py-2 text-sm font-medium whitespace-nowrap text-ink/70 md:text-base"
            >
              {sector}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
