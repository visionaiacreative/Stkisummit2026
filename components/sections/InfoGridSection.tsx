"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/lib/content";

const TOTAL_FRAMES = 999;
const CACHE_BUST = "v2";

function frameSrc(index: number) {
  return `/end-video/frame-${String(index).padStart(4, "0")}.webp?${CACHE_BUST}`;
}

export default function InfoGridSection() {
  const { lang } = useLanguage();
  const t = content.infoGrid[lang];

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const currentFrameRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  function applyFrame(progress: number) {
    const img = imgRef.current;
    if (!img) return;
    const frameIndex = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(progress * (TOTAL_FRAMES - 1)) + 1));
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      img.src = frameSrc(frameIndex);
    }
  }

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    applyFrame(latest);
  });

  // Mobile: its own pinned scrub, independent of the desktop container above.
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileImgRef = useRef<HTMLImageElement>(null);
  const mobileCurrentFrameRef = useRef(0);

  const { scrollYProgress: mobileScrollYProgress } = useScroll({
    target: mobileContainerRef,
    offset: ["start start", "end end"],
  });

  function applyMobileFrame(progress: number) {
    const img = mobileImgRef.current;
    if (!img) return;
    const frameIndex = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(progress * (TOTAL_FRAMES - 1)) + 1));
    if (frameIndex !== mobileCurrentFrameRef.current) {
      mobileCurrentFrameRef.current = frameIndex;
      img.src = frameSrc(frameIndex);
    }
  }

  useMotionValueEvent(mobileScrollYProgress, "change", (latest) => {
    applyMobileFrame(latest);
  });

  useEffect(() => {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const preload = new window.Image();
      preload.src = frameSrc(i);
    }
  }, []);

  return (
    <section id="info" className="relative bg-paper">
      {/* Mobile: text fades in, then its own pinned scroll-scrub reveal of the frame sequence */}
      <div className="flex flex-col items-center gap-6 px-6 pt-20 text-center md:hidden">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex w-full max-w-md flex-col items-center gap-5"
        >
          <h2 className="heading text-ink">{t.title}</h2>
          <span className="h-1 w-12 rounded-full bg-brand-red" />
          <p className="text-lg leading-relaxed text-ink/60">{t.body}</p>
        </motion.div>
      </div>

      <div ref={mobileContainerRef} className="relative bg-paper md:hidden" style={{ height: "180vh" }}>
        <div className="sticky top-0 flex min-h-screen items-center justify-center px-6">
          <img ref={mobileImgRef} src={frameSrc(1)} alt="" className="w-full max-w-md" />
        </div>
      </div>

      {/* Desktop: scroll-jacked scrubbed reveal */}
      <div ref={containerRef} className="relative hidden md:block md:h-[260vh]">
        <div className="sticky top-0 flex min-h-screen flex-col items-center justify-start gap-8 px-6 pt-28 pb-16 md:flex-row md:items-end md:justify-between md:gap-10 md:px-0 md:pt-0 md:pb-0">
          <div className="flex w-full max-w-md flex-col items-center gap-5 text-center md:max-w-sm md:shrink-0 md:items-start md:gap-6 md:self-center md:ps-16 md:pe-10 md:text-start">
            <h2 className="heading text-ink">{t.title}</h2>
            <span className="h-1 w-12 rounded-full bg-brand-red" />
            <p className="text-lg leading-relaxed text-ink/60 md:text-xl">{t.body}</p>
          </div>

          <div className="w-full max-w-md md:max-w-none md:min-w-0 md:flex-1">
            <img ref={imgRef} src={frameSrc(1)} alt="" className="h-auto w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
