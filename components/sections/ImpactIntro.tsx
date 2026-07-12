"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/lib/content";

const START_THRESHOLD = 0.02;
const STEP_THRESHOLDS = [0.15, 0.28, 0.4];
const FRAMES_START = STEP_THRESHOLDS[2];
const TOTAL_FRAMES = 1000;

const MOBILE_INTRO_PHASE_END = 0.66;
const MOBILE_INTRO_STEP_THRESHOLDS = [0.2, 0.4, 0.6, 0.8];
const MOBILE_VIDEO_FADE_START = 0.85;

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

function getMobileIntroStep(progress: number) {
  if (progress >= MOBILE_INTRO_PHASE_END) return 5;
  const normalized = progress / MOBILE_INTRO_PHASE_END;
  if (normalized < MOBILE_INTRO_STEP_THRESHOLDS[0]) return 0;
  if (normalized < MOBILE_INTRO_STEP_THRESHOLDS[1]) return 1;
  if (normalized < MOBILE_INTRO_STEP_THRESHOLDS[2]) return 2;
  if (normalized < MOBILE_INTRO_STEP_THRESHOLDS[3]) return 3;
  return 4;
}

function getMobileVideoOpacity(step: number, progress: number) {
  if (step < 5) return 0;
  if (progress < MOBILE_VIDEO_FADE_START) return 1;
  const fade = (progress - MOBILE_VIDEO_FADE_START) / (1 - MOBILE_VIDEO_FADE_START);
  return Math.max(0, 1 - fade);
}

function introItemMotion(step: number, itemStep: number) {
  return {
    opacity: step === itemStep ? 1 : 0,
    y: step === itemStep ? 0 : step < itemStep ? 16 : -16,
  };
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

  function applyFrame(scrollProgress: number) {
    const img = imgRef.current;
    if (!img) return;
    const frameProgress = Math.min(1, Math.max(0, (scrollProgress - FRAMES_START) / (1 - FRAMES_START)));
    const frameIndex = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(frameProgress * (TOTAL_FRAMES - 1)) + 1));
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      img.src = frameSrc(frameIndex);
    }
  }

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setStep(getStep(latest));
    applyFrame(latest);
  });

  // Mobile: one continuous pinned reveal — welcome, STKI Summit title, then the stat lines —
  // each swapping via fade in the same spot instead of scrolling away.
  const mobileIntroRef = useRef<HTMLDivElement>(null);
  const [mobileIntroStep, setMobileIntroStep] = useState(0);

  const { scrollYProgress: mobileIntroScrollYProgress } = useScroll({
    target: mobileIntroRef,
    offset: ["start start", "end end"],
  });

  // Mobile: hero video autoplays once when it comes into view, then fades out as the user
  // keeps scrolling (sharing the same continuous pinned range as the text above).
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [mobileVideoOpacity, setMobileVideoOpacity] = useState(0);
  const [videoLocked, setVideoLocked] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const videoPlayedRef = useRef(false);

  useMotionValueEvent(mobileIntroScrollYProgress, "change", (latest) => {
    const nextStep = getMobileIntroStep(latest);
    setMobileIntroStep(nextStep);
    setMobileVideoOpacity(getMobileVideoOpacity(nextStep, latest));
  });

  // Autoplay the video exactly once, locking scroll while it plays. One second before it
  // ends, reveal the scroll prompt and unlock scrolling so the user can move on.
  useEffect(() => {
    if (mobileIntroStep !== 5 || videoPlayedRef.current) return;
    const video = mobileVideoRef.current;
    if (!video) return;
    videoPlayedRef.current = true;
    setVideoLocked(true);
    video.currentTime = 0;
    video.play().catch(() => {});

    function release() {
      setShowScrollIndicator(true);
      setVideoLocked(false);
    }
    function handleTimeUpdate() {
      if (!video) return;
      if (video.duration && video.duration - video.currentTime <= 1) release();
    }
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", release);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", release);
    };
  }, [mobileIntroStep]);

  // Block scroll input (wheel/touch) on mobile while the video is playing.
  useEffect(() => {
    if (!videoLocked || !window.matchMedia("(max-width: 767px)").matches) return;
    function preventScroll(e: Event) {
      e.preventDefault();
    }
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, [videoLocked]);

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) return;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const preload = new window.Image();
      preload.src = frameSrc(i);
    }
  }, []);

  return (
    <div id="intro">
      {/* Mobile: one pinned reveal for welcome, STKI Summit title, the stat lines, then the hero video — all in the same spot */}
      <div ref={mobileIntroRef} className="relative bg-paper px-6 md:hidden" style={{ height: "530vh" }}>
        <div className="sticky top-0 flex min-h-screen items-center justify-center text-center">
          <div className="relative flex h-56 w-full items-center justify-center">
            <motion.span
              animate={introItemMotion(mobileIntroStep, 0)}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute text-xs font-semibold tracking-[0.3em] whitespace-nowrap text-ink/50 uppercase"
            >
              Welcome to
            </motion.span>

            <motion.div
              animate={{
                opacity: mobileIntroStep === 1 ? 1 : 0,
                y: mobileIntroStep === 1 ? 0 : mobileIntroStep < 1 ? 16 : -16,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute flex flex-col items-center gap-3"
            >
              <span className="text-2xl font-bold whitespace-nowrap tracking-wide text-ink">STKI Summit 2026</span>
              <span className="h-1 w-10 rounded-full bg-brand-red" />
            </motion.div>

            {/* Stat lines: accumulate and stay visible together, then fade out as a group before the video */}
            <div className="absolute flex flex-col items-center gap-4">
              <motion.p
                animate={{
                  opacity: mobileIntroStep >= 2 && mobileIntroStep <= 4 ? 1 : 0,
                  y: mobileIntroStep >= 2 && mobileIntroStep <= 4 ? 0 : 16,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-4xl leading-tight font-semibold text-ink sm:text-5xl"
              >
                <span className="text-brand-red">34</span> {t.yearsLabel}
              </motion.p>

              <motion.p
                animate={{
                  opacity: mobileIntroStep >= 3 && mobileIntroStep <= 4 ? 1 : 0,
                  y: mobileIntroStep >= 3 && mobileIntroStep <= 4 ? 0 : 16,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-4xl leading-tight font-semibold text-ink sm:text-5xl"
              >
                <span className="text-brand-red">1,500</span> {t.decisionMakersLabel}
              </motion.p>

              <motion.p
                animate={{
                  opacity: mobileIntroStep === 4 ? 1 : 0,
                  y: mobileIntroStep === 4 ? 0 : mobileIntroStep < 4 ? 16 : -16,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-5xl leading-tight font-extrabold text-ink sm:text-6xl"
              >
                {t.oneSummit}
              </motion.p>
            </div>

            <motion.div
              animate={{ opacity: mobileVideoOpacity }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute w-full max-w-sm"
            >
              <video
                ref={mobileVideoRef}
                src="/videos/hero-mobile.mp4"
                muted
                playsInline
                preload="auto"
                className="mix-blend-multiply w-full"
              />
            </motion.div>
          </div>

          <motion.div
            animate={{ opacity: showScrollIndicator && mobileIntroStep === 5 ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute bottom-10 flex flex-col items-center gap-3 text-ink/40"
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
        </div>
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
