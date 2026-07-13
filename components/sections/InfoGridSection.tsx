"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/lib/content";

export default function InfoGridSection() {
  const { lang } = useLanguage();
  const t = content.infoGrid[lang];

  return (
    <section id="info" className="relative bg-paper">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 pt-4 pb-16 text-center md:py-20">
        <h2 className="heading text-ink">{t.title}</h2>
        <span className="h-1 w-12 rounded-full bg-brand-red" />
        <p className="text-lg leading-relaxed text-ink/60 md:text-xl md:leading-loose">{t.body}</p>
      </div>
    </section>
  );
}
