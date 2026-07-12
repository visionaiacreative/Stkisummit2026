# Backup: Scroll Character Sequence feature (2026-07-10)

This is a snapshot of the "landing / run / sit" scroll character feature exactly
as it exists on the site right now. Nothing has been removed from the live
site — this file exists purely so the feature can be restored precisely if it's
ever taken down later. If that happens, send this file back and the following
will be restored exactly:

1. Re-create `components/ScrollCharacterSequence.tsx` with the content below.
2. Re-wrap `app/page.tsx` exactly as shown below (import + JSX wrapper).
3. Confirm `public/landing-run-sit/frame-0001.webp` … `frame-1000.webp` still
   exist (1000 frames, extracted from `videos/נוחת, רץ, יושב.mp4` with a
   transparent background via ffmpeg colorkey). These were never deleted, so
   normally nothing needs to be redone here — just double check they're there.

## What this feature does (for context)

A small character (from the STKI logo) floats fixed in the top-left corner
from `HeroSection` onward (not during the `ImpactIntro` hero). It plays through
a 1000-frame sequence tied to scroll:

- Frames 87→127 map to scroll position across `HeroSection`, timed so frame
  127 (landing pose) is reached right as `AboutSection` ("אודות הכנס") begins,
  with a short hold there.
- At frame 130, page scrolling **locks** (via `document.body.style.overflow`
  + Lenis `pauseSmoothScroll()`) and the user's own wheel/touch/keyboard input
  drives the frame count forward instead of the page — a "cutscene".
- From frame 761 he starts sliding left off-screen, fully exiting by frame 850
  (not 1000 — the rest of the sequence is unused). The lock releases the
  instant he's off-screen, restoring normal scrolling.
- This isn't one-way: if the user scrolls back up past the trigger point, he
  reappears and the scroll-driven landing sequence plays again.

## How to remove it later (when asked)

In `app/page.tsx`, remove the `ScrollCharacterSequence` import and unwrap its
children back to being direct children of `<main>` (i.e. reverse the diff
below). Do **not** delete `components/ScrollCharacterSequence.tsx` or
`public/landing-run-sit/` unless explicitly told to — keep them so it can be
switched back on instantly by re-adding the wrapper.

## How to restore it exactly

Re-apply both files below verbatim, and re-confirm the wrapper is present in
`app/page.tsx`.

---

### `app/page.tsx` (current, working state)

```tsx
import ImpactIntro from "@/components/sections/ImpactIntro";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import AudienceSection from "@/components/sections/AudienceSection";
import TechTalkSection from "@/components/sections/TechTalkSection";
import GallerySection from "@/components/sections/GallerySection";
import SponsorshipSection from "@/components/sections/SponsorshipSection";
import InfoGridSection from "@/components/sections/InfoGridSection";
import EventDetailsBar from "@/components/sections/EventDetailsBar";
import VisionCredit from "@/components/sections/VisionCredit";
import ScrollCharacterSequence from "@/components/ScrollCharacterSequence";

export default function Home() {
  return (
    <main>
      <ImpactIntro />
      <ScrollCharacterSequence>
        <HeroSection />
        <AboutSection />
        <AudienceSection />
        <TechTalkSection />
        <GallerySection />
        <SponsorshipSection />
        <InfoGridSection />
        <EventDetailsBar />
        <div className="h-3 bg-paper shadow-[0_0_18px_rgba(255,255,255,0.5)]" />
        <VisionCredit />
      </ScrollCharacterSequence>
    </main>
  );
}
```

### `components/ScrollCharacterSequence.tsx` (current, working state)

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { pauseSmoothScroll, resumeSmoothScroll } from "@/components/SmoothScroll";

const TOTAL_FRAMES = 1000;
const START_FRAME = 87;
const LANDING_FRAME = 127;
const LOCK_FRAME = 130;
const HOLD_FRACTION = 0.127;
const FADE = 0.02;
// start tracking this many px before the container's own top reaches the
// viewport top, so the sequence kicks off earlier
const LEAD_IN_PX = 135;
// cumulative wheel/touch/keyboard px needed, once locked, to play frames
// LOCK_FRAME -> TOTAL_FRAMES before normal page scrolling is allowed again
const LOCK_SCROLL_DISTANCE = 4000;
// from this frame onward (the running part) the character slides left off
// screen, fully exiting by RUN_OFF_END_FRAME - the rest of the sequence
// (up to TOTAL_FRAMES) is never needed, the lock releases as soon as he's gone
const RUN_OFF_START_FRAME = 761;
const RUN_OFF_END_FRAME = 850;
const RUN_OFF_DISTANCE_PX = 700;

function frameSrc(index: number) {
  return `/landing-run-sit/frame-${String(index).padStart(4, "0")}.webp`;
}

type Mode = "scroll" | "locked" | "exited";

export default function ScrollCharacterSequence({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const currentFrameRef = useRef(0);
  const boundaryRef = useRef(0.12);

  const modeRef = useRef<Mode>("scroll");
  const lockDeltaRef = useRef(0);
  const lockCleanupRef = useRef<(() => void) | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: [`start ${LEAD_IN_PX}px`, "end end"],
  });

  useEffect(() => {
    function measure() {
      const container = containerRef.current;
      const boundaryEl = document.getElementById("about");
      if (!container || !boundaryEl) return;
      const containerRect = container.getBoundingClientRect();
      const boundaryRect = boundaryEl.getBoundingClientRect();
      // matches the offset=[`start ${LEAD_IN_PX}px`, "end end"] mapping above:
      // progress 0 happens LEAD_IN_PX before the container's top would reach
      // the viewport top, so the scrollable range is that much longer too
      const scrollableHeight = container.offsetHeight - window.innerHeight + LEAD_IN_PX;
      if (scrollableHeight <= 0) return;
      const offset = boundaryRect.top - containerRect.top + LEAD_IN_PX;
      boundaryRef.current = Math.min(0.95, Math.max(0.02, offset / scrollableHeight));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  function setFrame(frameFloat: number) {
    const img = imgRef.current;
    const wrapper = wrapperRef.current;
    if (!img || !wrapper) return;
    const clamped = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(frameFloat)));
    if (clamped !== currentFrameRef.current) {
      currentFrameRef.current = clamped;
      img.src = frameSrc(clamped);
    }

    const runT =
      clamped <= RUN_OFF_START_FRAME
        ? 0
        : Math.min(1, (clamped - RUN_OFF_START_FRAME) / (RUN_OFF_END_FRAME - RUN_OFF_START_FRAME));
    wrapper.style.transform = `translateX(${-runT * RUN_OFF_DISTANCE_PX}px)`;
  }

  function engageLock() {
    if (modeRef.current === "locked") return;
    modeRef.current = "locked";
    lockDeltaRef.current = 0;
    pauseSmoothScroll();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function advance(delta: number) {
      lockDeltaRef.current += delta;

      if (lockDeltaRef.current <= 0 && currentFrameRef.current <= LOCK_FRAME) {
        finish(false);
        return;
      }

      const t = Math.min(1, Math.max(0, lockDeltaRef.current / LOCK_SCROLL_DISTANCE));
      setFrame(LOCK_FRAME + t * (TOTAL_FRAMES - LOCK_FRAME));

      // release as soon as he's run off-screen, no need to play out the
      // rest of the sequence up to TOTAL_FRAMES
      if (currentFrameRef.current >= RUN_OFF_END_FRAME) finish(true);
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      advance(e.deltaY);
    }

    let touchStartY = 0;
    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY;
    }
    function onTouchMove(e: TouchEvent) {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      advance(touchStartY - currentY);
      touchStartY = currentY;
    }

    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        advance(80);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        advance(-80);
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    function finish(completed: boolean) {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      resumeSmoothScroll();
      modeRef.current = completed ? "exited" : "scroll";
      lockCleanupRef.current = null;
      if (completed && wrapperRef.current) {
        // he's already run off-screen at this point - hide him, but this
        // isn't permanent: scrolling back up past the trigger point flips
        // back to "scroll" mode and brings him back (see the effect below)
        wrapperRef.current.style.opacity = "0";
      }
    }

    lockCleanupRef.current = () => finish(false);
  }

  useEffect(() => {
    return () => {
      lockCleanupRef.current?.();
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const boundary = boundaryRef.current;
    const holdEnd = Math.min(1, boundary + HOLD_FRACTION);

    if (modeRef.current === "exited") {
      if (latest < holdEnd) {
        // scrolled back up past the trigger point - bring him back
        modeRef.current = "scroll";
      } else {
        wrapper.style.opacity = "0";
        return;
      }
    }

    if (modeRef.current === "scroll") {
      let frameFloat: number;
      if (latest <= boundary) {
        const t = boundary <= 0 ? 1 : latest / boundary;
        frameFloat = START_FRAME + t * (LANDING_FRAME - START_FRAME);
      } else if (latest <= holdEnd) {
        frameFloat = LANDING_FRAME;
      } else {
        frameFloat = LOCK_FRAME;
      }
      setFrame(frameFloat);

      if (currentFrameRef.current >= LOCK_FRAME) {
        engageLock();
      }
    }

    const opacity = latest < FADE ? latest / FADE : latest > 1 - FADE ? (1 - latest) / FADE : 1;
    wrapper.style.opacity = String(Math.max(0, Math.min(1, opacity)));
  });

  useEffect(() => {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const preload = new window.Image();
      preload.src = frameSrc(i);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {children}
      <div
        ref={wrapperRef}
        className="pointer-events-none fixed top-24 left-4 z-30 w-[180px] opacity-0 sm:left-8 sm:w-[240px] md:left-10 md:w-[280px]"
      >
        <img ref={imgRef} src={frameSrc(START_FRAME)} alt="" className="h-auto w-full drop-shadow-lg" />
      </div>
    </div>
  );
}
```
