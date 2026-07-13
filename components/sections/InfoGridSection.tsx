"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/lib/content";

export default function InfoGridSection() {
  const { lang } = useLanguage();
  const t = content.infoGrid[lang];

  // Desktop booth video: don't start playing until the section is actually
  // scrolled into view, otherwise it autoplays on page load and is already
  // mid-loop (or finished) by the time the user scrolls down to see it.
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoInView = useInView(desktopVideoRef, { amount: 0.4 });

  useEffect(() => {
    const video = desktopVideoRef.current;
    if (!video) return;
    if (desktopVideoInView) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [desktopVideoInView]);

  return (
    <section id="info" className="relative bg-paper">
      {/* Mobile: title + body only. No video on mobile — the booth video is desktop-only. */}
      <div className="flex flex-col items-center gap-5 px-6 pt-4 pb-16 text-center md:hidden">
        <h2 className="heading text-ink">{t.title}</h2>
        <span className="h-1 w-12 rounded-full bg-brand-red" />
        <p className="text-lg leading-relaxed text-ink/60">{t.body}</p>
      </div>

      {/* Desktop: title + body beside the booth video (background cleaned to
          white); the video is enlarged and anchored to the bottom-start
          corner of the section. */}
      <div className="mx-auto hidden max-w-[1600px] flex-row items-end justify-between gap-10 pt-24 pb-0 ps-16 pe-0 md:flex">
        <div className="flex w-full max-w-xs shrink-0 flex-col items-start gap-6 pb-24 text-start">
          <h2 className="heading text-ink">{t.title}</h2>
          <span className="h-1 w-12 rounded-full bg-brand-red" />
          <p className="text-xl leading-loose text-ink/60">{t.body}</p>
        </div>

        <div
          className="relative w-full min-w-0 flex-1 self-end overflow-hidden bg-paper"
          style={{ transform: "scale(1.08)", transformOrigin: "left bottom" }}
        >
          <video
            ref={desktopVideoRef}
            src="/videos/sponsorship-booth-white-desktop.mp4"
            loop
            muted
            playsInline
            preload="auto"
            className="block h-auto w-full bg-paper"
            style={{ border: "none", outline: "none" }}
          />
        </div>
      </div>
    </section>
  );
}
