"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";

function ArticleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-brand-red">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.5 8.5H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7.5 12H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7.5 15.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EventIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-brand-red">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 9.5H20.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 3V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ExposureIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-brand-red">
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M8.5 8.5a5 5 0 000 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15.5 8.5a5 5 0 010 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5.5 5.5a9 9 0 000 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18.5 5.5a9 9 0 010 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const pointIcons = [ArticleIcon, EventIcon, ExposureIcon];

export default function SponsorshipSection() {
  const { lang } = useLanguage();
  const t = content.sponsorship[lang];

  return (
    <section id="sponsorship" className="bg-paper-soft px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div className="flex flex-col gap-6">
          <SectionHeading eyebrow={t.eyebrow} title={t.title} />
          <p className="max-w-4xl text-lg leading-relaxed text-ink/60 md:text-xl [text-align:justify]">
            {t.body}
          </p>
          <p className="max-w-4xl text-lg leading-relaxed text-ink/60 md:text-xl [text-align:justify]">
            {t.body2}
          </p>
          <p className="max-w-4xl text-lg leading-relaxed text-ink/60 md:text-xl [text-align:justify]">
            {t.body3}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <div
            className="absolute -inset-10 -z-10 [background-image:linear-gradient(to_right,var(--color-ink)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-ink)_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.05] [mask-image:radial-gradient(circle,black,transparent_75%)]"
          />
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-red/15 via-brand-red/5 to-transparent blur-2xl" />

          <div className="relative rounded-3xl border border-ink/10 bg-paper p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <span className="inline-flex items-center rounded-full bg-brand-red/10 px-4 py-1.5 text-sm font-bold text-brand-red">
              {t.badge}
            </span>

            <div className="mt-7 flex flex-col gap-5">
              {t.points.map((point, i) => {
                const Icon = pointIcons[i];
                return (
                  <div key={point} className="flex items-center gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/8">
                      <Icon />
                    </span>
                    <span className="font-medium text-ink">{point}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
