"use client";

import { useLanguage } from "@/components/LanguageProvider";
import {
  content,
  VISION_STUDIO_EMAIL,
  VISION_STUDIO_WHATSAPP_URL,
  VISION_STUDIO_INSTAGRAM_URL,
} from "@/lib/content";

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 6.5l8 6.5 8-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0012.04 2zm0 1.67c2.2 0 4.26.86 5.82 2.42a8.18 8.18 0 012.42 5.83c0 4.54-3.7 8.23-8.24 8.23a8.3 8.3 0 01-4.19-1.14l-.3-.18-3.12.82.83-3.04-.2-.32a8.17 8.17 0 01-1.25-4.36c0-4.54 3.69-8.24 8.23-8.24zm-3.51 2.96c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.23.89 2.41 1.01 2.58.13.16 1.75 2.73 4.29 3.77 2.11.86 2.54.7 3 .66.46-.04 1.46-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.22-.17-.46-.29-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19a7.23 7.23 0 01-1.33-1.65c-.14-.24-.02-.37.1-.49.11-.11.25-.29.37-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.31-.74-1.78-.19-.46-.39-.45-.54-.46-.14-.01-.3-.01-.46-.01z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export default function VisionCredit() {
  const { lang } = useLanguage();
  const t = content.visionCredit[lang];

  // Studio contact labels stay in English regardless of site language.
  const rows = [
    {
      key: "whatsapp",
      Icon: WhatsAppIcon,
      label: "WhatsApp",
      href: VISION_STUDIO_WHATSAPP_URL,
      external: true,
    },
    {
      key: "instagram",
      Icon: InstagramIcon,
      label: "Instagram",
      href: VISION_STUDIO_INSTAGRAM_URL,
      external: true,
    },
    {
      key: "email",
      Icon: MailIcon,
      value: VISION_STUDIO_EMAIL,
      href: `mailto:${VISION_STUDIO_EMAIL}`,
      external: false,
    },
  ];

  return (
    <section className="bg-ink px-6 py-10 text-paper md:px-16 md:py-14">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
        <div dir="ltr" className="order-2 flex flex-col items-start gap-4 md:order-1">
          {rows.map(({ key, Icon, label, value, href, external }) => (
            <a
              key={key}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="group flex min-w-0 items-center gap-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-paper/15 text-paper/70 transition-colors group-hover:border-paper/40 group-hover:text-white">
                <Icon />
              </span>
              {value ? (
                <span className="w-full min-w-0 text-sm font-medium break-words text-paper/85 transition-colors group-hover:text-white">
                  {value.includes("@") ? (
                    <>
                      {value.split("@")[0]}@<wbr />
                      {value.split("@")[1]}
                    </>
                  ) : (
                    value
                  )}
                </span>
              ) : (
                <span className="text-sm font-medium text-paper/85 transition-colors group-hover:text-white">
                  {label}
                </span>
              )}
            </a>
          ))}
        </div>

        <div className="order-2 hidden h-36 w-px shrink-0 bg-paper/10 md:block" />

        <div className="order-1 flex flex-col items-center gap-2 text-center md:order-3">
          <span className="text-[13px] tracking-[0.2em] text-paper/40 uppercase">{t.builtBy}</span>

          <span dir="ltr" className="text-2xl font-bold tracking-wide md:text-3xl">
            VISION AI STUDIO<sup className="text-sm">©</sup>
          </span>

          <div dir="ltr" className="mt-1 flex flex-col items-center gap-1">
            <span className="text-xs font-semibold tracking-[0.25em] text-paper/50 uppercase">
              Luxury Digital Studio
            </span>
            <span className="text-sm text-paper/60">AI • Web • Social</span>
            <span className="my-1 h-1 w-10 rounded-full bg-brand-red" />
            <span className="text-sm font-medium text-paper/80">Tell us your vision</span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-8 max-w-5xl pt-5">
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-red/50 to-transparent" />
        <p dir="ltr" className="text-center text-xs tracking-[0.15em] text-paper/35">
          {t.copyright}
        </p>
      </div>
    </section>
  );
}
