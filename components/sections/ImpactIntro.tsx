"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useMotionValueEvent } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/lib/content";
import { useFrameSequence } from "@/lib/useFrameSequence";
import FrameLoadIndicator from "@/components/ui/FrameLoadIndicator";

const START_THRESHOLD = 0.02;
const STEP_THRESHOLDS = [0.15, 0.28, 0.4];
const FRAMES_START = STEP_THRESHOLDS[2];
const TOTAL_FRAMES = 1000;

const MOBILE_START_THRESHOLD = 0.06;
const MOBILE_STEP_THRESHOLDS = [0.36, 0.64];

function frameSrc(index: number) {
  return `/hero-2/frame-${String(index).padStart(4, "0")}.webp`;
}

function getStep(progress: number) {
  if (progress < START_THRESHOLD) return -1;
  if (progress < STEP_THRESHOLDS[0]) return 0;
  if (progress < STEP_THRESHOLDS[1]) return 1;
  if (progress < STEP_THRESHOLDS[2]) return 2;
  return 3;
}

function getMobileStep(progress: number) {
  if (!Number.isFinite(progress) || progress < MOBILE_START_THRESHOLD) return -1;
  if (progress < MOBILE_STEP_THRESHOLDS[0]) return 0;
  if (progress < MOBILE_STEP_THRESHOLDS[1]) return 1;
  return 2;
}

export default function ImpactIntro() {
  const { lang } = useLanguage();
  const t = content.impact[lang];

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const currentFrameRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [step, setStep] = useState(-1);

  // hero-2 frames only render on desktop (mobile uses the video below), so
  // skip loading them entirely on mobile viewports, matching prior behavior.
  const [desktopSequenceEnabled] = useState(
    () => typeof window === "undefined" || !window.matchMedia("(max-width: 767px)").matches,
  );
  const { progress: loadProgress, ready: framesReady, frontierRef } = useFrameSequence({
    frameSrc,
    totalFrames: TOTAL_FRAMES,
    containerRef,
    rootMargin: "600px 0px",
    enabled: desktopSequenceEnabled,
  });

  function applyFrame(scrollProgress: number) {
    const img = imgRef.current;
    if (!img) return;
    const frameProgress = Math.min(1, Math.max(0, (scrollProgress - FRAMES_START) / (1 - FRAMES_START)));
    const targetFrame = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(frameProgress * (TOTAL_FRAMES - 1)) + 1));
    const frameIndex = Math.min(targetFrame, frontierRef.current);
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      img.src = frameSrc(frameIndex);
    }
  }

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setStep(getStep(latest));
    applyFrame(latest);
  });

  // Mobile: same three-step stat reveal as desktop (34 years / 1,500 execs / one
  // summit), pinned over its own scroll range, without the heavy frame sequence.
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const [mobileStep, setMobileStep] = useState(-1);

  const { scrollYProgress: mobileScrollYProgress } = useScroll({
    target: mobileContainerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(mobileScrollYProgress, "change", (latest) => {
    setMobileStep(getMobileStep(latest));
  });

  // Mobile: plain (non-scroll-jacked) video after the stat reveal. Plays once
  // as soon as it scrolls into view and freezes on its last frame (no loop).
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoInView = useInView(mobileVideoRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!mobileVideoInView) return;
    mobileVideoRef.current?.play().catch(() => {});
  }, [mobileVideoInView]);

  return (
    <div id="intro">
      {/* Mobile: scroll-jacked pinned reveal, same 34/1,500/one-summit sequence as
          desktop, minus the frame-sequence image (never loaded on mobile). */}
      <div ref={mobileContainerRef} className="relative bg-paper md:hidden" style={{ height: "420vh" }}>
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6 text-center">
          <motion.div
            animate={{ opacity: mobileStep >= 0 ? 1 : 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-3"
          >
            <motion.p
              animate={{ opacity: mobileStep >= 0 ? 1 : 0, y: mobileStep >= 0 ? 0 : 16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-4xl leading-tight font-semibold text-ink"
            >
              <span className="text-brand-red">34</span> {t.yearsLabel}
            </motion.p>
            <motion.p
              animate={{ opacity: mobileStep >= 1 ? 1 : 0, y: mobileStep >= 1 ? 0 : 16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-4xl leading-tight font-semibold text-ink"
            >
              <span className="text-brand-red">1,500</span> {t.decisionMakersLabel}
            </motion.p>
            <motion.p
              animate={{ opacity: mobileStep >= 2 ? 1 : 0, y: mobileStep >= 2 ? 0 : 16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-5xl leading-tight font-extrabold text-ink"
            >
              {t.oneSummit}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ top: "50%" }}
            animate={{ top: mobileStep === -1 ? "50%" : "92%" }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ x: "-50%", y: "-50%" }}
            className="absolute left-1/2 flex flex-col items-center gap-3 text-ink/40"
          >
            <AnimatePresence>
              {mobileStep === -1 && (
                <motion.div
                  key="welcome"
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8 flex flex-col items-center gap-3"
                >
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                    className="text-xs font-semibold tracking-[0.3em] uppercase text-ink/50"
                  >
                    Welcome to
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 1.7 }}
                    className="text-2xl font-bold tracking-wide text-ink"
                  >
                    STKI Summit 2026
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 3.1 }}
              className="flex flex-col items-center gap-3"
            >
              <span className="text-xs font-semibold tracking-[0.3em] uppercase">Scroll to explore</span>
              <svg width="22" height="34" viewBox="0 0 22 34" fill="none">
                <rect x="1" y="1" width="20" height="32" rx="10" stroke="currentColor" strokeWidth="1.6" />
                <motion.circle
                  cx="11"
                  r="1.8"
                  fill="currentColor"
                  animate={{ cy: [8, 21], opacity: [1, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>
              <div className="flex flex-col -space-y-1">
                {[0, 1].map((i) => (
                  <motion.svg
                    key={i}
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    animate={{ opacity: [0.15, 1, 0.15] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  >
                    <path
                      d="M1 1l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile: plain video reveal (no scroll-jacking), plays once on view */}
      <div className="bg-paper px-6 pb-16 md:hidden">
        <video
          ref={mobileVideoRef}
          src="/videos/hero-mobile-2-white.mp4"
          muted
          playsInline
          preload="auto"
          className="mx-auto w-full max-w-md"
        />
      </div>

      {/* Desktop: scroll-jacked pinned reveal */}
      <div ref={containerRef} className="relative hidden bg-paper md:block md:h-[260vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6 text-center">
        <div className="relative h-full w-full">
          <motion.div
            animate={{ opacity: step < 3 ? 1 : 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 md:gap-4"
          >
            <motion.p
              animate={{ opacity: step >= 0 ? 1 : 0, y: step >= 0 ? 0 : 16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-4xl leading-tight font-semibold text-ink sm:text-5xl md:text-6xl"
            >
              <span className="text-brand-red">34</span> {t.yearsLabel}
            </motion.p>
            <motion.p
              animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-4xl leading-tight font-semibold text-ink sm:text-5xl md:text-6xl"
            >
              <span className="text-brand-red">1,500</span> {t.decisionMakersLabel}
            </motion.p>
            <motion.p
              animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-5xl leading-tight font-extrabold text-ink sm:text-6xl md:text-7xl"
            >
              {t.oneSummit}
            </motion.p>
          </motion.div>

          <motion.div
            animate={{ opacity: step === 3 ? 1 : 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              ref={imgRef}
              src={frameSrc(1)}
              alt=""
              className="h-auto w-full max-w-4xl md:max-w-6xl"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 1.5%, black 98.5%, transparent), linear-gradient(to bottom, transparent, black 1.5%, black 98.5%, transparent)",
                maskComposite: "intersect",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 1.5%, black 98.5%, transparent), linear-gradient(to bottom, transparent, black 1.5%, black 98.5%, transparent)",
                WebkitMaskComposite: "source-in",
              }}
            />
            <FrameLoadIndicator progress={loadProgress} visible={step === 3 && !framesReady} />
          </motion.div>
        </div>

        <motion.div
          initial={{ top: "50%" }}
          animate={{ top: step === -1 ? "50%" : "92%" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ x: "-50%", y: "-50%" }}
          className="absolute left-1/2 flex flex-col items-center gap-3 text-ink/40"
        >
          <AnimatePresence>
            {step === -1 && (
              <motion.div
                key="welcome"
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mb-8 flex flex-col items-center gap-3"
              >
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                  className="text-sm font-semibold tracking-[0.3em] uppercase text-ink/50 sm:text-base"
                >
                  Welcome to
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 1.7 }}
                  className="text-2xl font-bold tracking-wide text-ink sm:text-3xl"
                >
                  STKI Summit 2026
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 3.1 }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-xs font-semibold tracking-[0.3em] uppercase">Scroll to explore</span>
            <svg width="22" height="34" viewBox="0 0 22 34" fill="none">
              <rect x="1" y="1" width="20" height="32" rx="10" stroke="currentColor" strokeWidth="1.6" />
              <motion.circle
                cx="11"
                r="1.8"
                fill="currentColor"
                animate={{ cy: [8, 21], opacity: [1, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
            <div className="flex flex-col -space-y-1">
              {[0, 1].map((i) => (
                <motion.svg
                  key={i}
                  width="14"
                  height="8"
                  viewBox="0 0 14 8"
                  fill="none"
                  animate={{ opacity: [0.15, 1, 0.15] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                >
                  <path
                    d="M1 1l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
