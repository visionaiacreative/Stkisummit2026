"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import {
  content,
  REGISTRATION_URL,
  SPONSOR_COORDINATION_EMAIL,
  STKI_WHATSAPP_URL,
  STKI_PHONE,
  formatPhone,
} from "@/lib/content";

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0012.04 2zm0 1.67c2.2 0 4.26.86 5.82 2.42a8.18 8.18 0 012.42 5.83c0 4.54-3.7 8.23-8.24 8.23a8.3 8.3 0 01-4.19-1.14l-.3-.18-3.12.82.83-3.04-.2-.32a8.17 8.17 0 01-1.25-4.36c0-4.54 3.69-8.24 8.23-8.24zm-3.51 2.96c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.23.89 2.41 1.01 2.58.13.16 1.75 2.73 4.29 3.77 2.11.86 2.54.7 3 .66.46-.04 1.46-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.22-.17-.46-.29-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19a7.23 7.23 0 01-1.33-1.65c-.14-.24-.02-.37.1-.49.11-.11.25-.29.37-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.31-.74-1.78-.19-.46-.39-.45-.54-.46-.14-.01-.3-.01-.46-.01z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4 6.5l8 6.5 8-6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function EventDetailsBar() {
  const { lang } = useLanguage();
  const t = content.eventBar[lang];
  const sponsorCta = content.infoGrid[lang].cta;

  // Animated WebP starts playing the instant it loads, regardless of scroll
  // position — without this, it plays its run-and-sit animation off-screen
  // and has already settled into the final still frame by the time the user
  // scrolls down to it. Deferring the <img> mount until the section is
  // actually in view makes the animation start fresh when it's first seen.
  const runSitRef = useRef<HTMLDivElement>(null);
  const runSitInView = useInView(runSitRef, { once: true, amount: 0.4 });

  const pills = [
    {
      key: "whatsapp",
      href: STKI_WHATSAPP_URL,
      external: true,
      label: t.whatsappLabel,
      value: formatPhone(STKI_PHONE),
      Icon: WhatsAppIcon,
    },
    {
      key: "email",
      href: `mailto:${SPONSOR_COORDINATION_EMAIL}`,
      external: false,
      value: SPONSOR_COORDINATION_EMAIL,
      Icon: MailIcon,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-paper-soft px-6 py-16 md:px-16 md:py-20">
      <div
        className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_15%_20%,color-mix(in_srgb,var(--brand-red)_10%,transparent),transparent_45%),radial-gradient(circle_at_85%_80%,color-mix(in_srgb,var(--brand-red)_10%,transparent),transparent_45%)]"
      />

      <div
        ref={runSitRef}
        className="pointer-events-none absolute top-1/2 hidden w-[280px] -translate-y-1/2 start-6 xl:block 2xl:w-[360px] 2xl:start-12"
        style={{ aspectRatio: "640 / 621" }}
      >
        {runSitInView && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/videos/run-sit-once.webp" alt="" className="h-full w-full" />
        )}
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-semibold tracking-[0.2em] text-brand-red uppercase">
            {t.eyebrow}
          </span>
          <span className="h-1 w-10 rounded-full bg-brand-red" />
        </div>

        <h2 className="heading text-ink">{t.ctaLabel}</h2>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          {pills.map(({ key, href, external, label, value, Icon }) => (
            <a
              key={key}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-3 rounded-full border border-ink/10 bg-paper px-5 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:border-brand-red hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-red/8 text-brand-red">
                <Icon />
              </span>
              <span className="flex flex-col items-start text-start">
                {label && <span className="text-xs font-medium text-ink/50">{label}</span>}
                <span dir="ltr" className="text-sm font-semibold text-ink">
                  {value}
                </span>
              </span>
            </a>
          ))}
        </div>

        <a
          href={REGISTRATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-fit items-center gap-3 rounded-full bg-ink px-7 py-4 font-semibold text-paper transition-transform hover:-translate-y-0.5"
        >
          {sponsorCta}
          <ArrowIcon />
        </a>
      </div>
    </section>
  );
}
