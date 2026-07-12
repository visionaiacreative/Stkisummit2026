"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/lib/content";
import { useFrameSequence } from "@/lib/useFrameSequence";
import FrameLoadIndicator from "@/components/ui/FrameLoadIndicator";

const TOTAL_FRAMES = 999;
const CACHE_BUST = "v2";

function frameSrc(index: number) {
  return `/end-video/frame-${String(index).padStart(4, "0")}.webp?${CACHE_BUST}`;
}

export default function InfoGridSection() {
  const { lang } = useLanguage();
  const t = content.infoGrid[lang];

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const currentFrameRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // The frame sequence image is desktop-only; skip loading it on mobile entirely.
  const [desktopSequenceEnabled] = useState(
    () => typeof window === "undefined" || !window.matchMedia("(max-width: 767px)").matches,
  );
  const { progress: loadProgress, ready: framesReady, frontierRef } = useFrameSequence({
    frameSrc,
    totalFrames: TOTAL_FRAMES,
    containerRef: sectionRef,
    rootMargin: "1000px 0px",
    enabled: desktopSequenceEnabled,
  });

  function applyFrame(progress: number) {
    const img = imgRef.current;
    if (!img) return;
    const targetFrame = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(progress * (TOTAL_FRAMES - 1)) + 1));
    const frameIndex = Math.min(targetFrame, frontierRef.current);
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      img.src = frameSrc(frameIndex);
    }
  }

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    applyFrame(latest);
  });

  return (
    <section id="info" ref={sectionRef} className="relative bg-paper">
      {/* Mobile: title + body, then the booth video (background cleaned to white) */}
      <div className="flex flex-col items-center gap-5 px-6 py-20 text-center md:hidden">
        <h2 className="heading text-ink">{t.title}</h2>
        <span className="h-1 w-12 rounded-full bg-brand-red" />
        <p className="text-lg leading-relaxed text-ink/60">{t.body}</p>
      </div>
      <div className="px-6 pb-0 md:hidden">
        <video
          src="/videos/sponsorship-booth-white.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full"
        />
      </div>

      {/* Desktop: scroll-jacked scrubbed reveal */}
      <div ref={containerRef} className="relative hidden md:block md:h-[260vh]">
        <div className="sticky top-0 flex min-h-screen flex-col items-center justify-start gap-8 px-6 pt-28 pb-16 md:flex-row md:items-end md:justify-between md:gap-10 md:px-0 md:pt-0 md:pb-0">
          <div className="flex w-full max-w-md flex-col items-center gap-5 text-center md:max-w-sm md:shrink-0 md:items-start md:gap-6 md:self-center md:ps-16 md:pe-10 md:text-start">
            <h2 className="heading text-ink">{t.title}</h2>
            <span className="h-1 w-12 rounded-full bg-brand-red" />
            <p className="text-lg leading-relaxed text-ink/60 md:text-xl">{t.body}</p>
          </div>

          <div className="relative w-full max-w-md md:max-w-none md:min-w-0 md:flex-1">
            <img ref={imgRef} src={frameSrc(1)} alt="" className="h-auto w-full" />
            <FrameLoadIndicator progress={loadProgress} visible={!framesReady} />
          </div>
        </div>
      </div>
    </section>
  );
}
