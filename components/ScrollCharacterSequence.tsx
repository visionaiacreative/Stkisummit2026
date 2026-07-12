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
