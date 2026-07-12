"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/lib/content";

export default function LanguageToggle() {
  const { lang, toggle } = useLanguage();

  return (
    <button
      onClick={toggle}
      dir="ltr"
      className="rounded-full border border-ink/15 bg-paper px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:border-brand-red hover:text-brand-red"
    >
      {content.nav[lang].languageToggleLabel}
    </button>
  );
}
