"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

const CONCURRENCY = 12;

interface UseFrameSequenceOptions {
  frameSrc: (index: number) => string;
  totalFrames: number;
  /** Element watched to know when the sequence is worth loading. */
  containerRef: RefObject<Element | null>;
  /** How far before the container enters the viewport loading should start. */
  rootMargin?: string;
  enabled?: boolean;
}

interface UseFrameSequenceResult {
  /** 0-1, driven by the contiguous run of loaded frames (safe for a progress bar). */
  progress: number;
  ready: boolean;
  /**
   * Highest frame index guaranteed loaded so far, read fresh on every scroll
   * tick without triggering re-renders.
   */
  frontierRef: RefObject<number>;
}

// Loads a frame sequence with bounded concurrency (instead of firing every
// request at once) and only once the container is close to the viewport, so
// the ~1000 requests don't all compete with page-load-critical assets. The
// contiguous "frontier" lets callers clamp the target frame to what's
// actually been downloaded, instead of pointing <img src> at a frame that
// hasn't arrived yet.
export function useFrameSequence({
  frameSrc,
  totalFrames,
  containerRef,
  rootMargin = "800px 0px",
  enabled = true,
}: UseFrameSequenceOptions): UseFrameSequenceResult {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const frontierRef = useRef(1);

  useEffect(() => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    let pendingFlush = false;
    const loaded = new Uint8Array(totalFrames + 1);
    let frontier = 1;

    function flush() {
      pendingFlush = false;
      if (!cancelled) setProgress(frontier / totalFrames);
    }
    function scheduleFlush() {
      if (pendingFlush) return;
      pendingFlush = true;
      // setTimeout rather than requestAnimationFrame: rAF is suspended in
      // hidden/backgrounded tabs, and this is a data update, not a
      // paint-synced animation, so it doesn't need frame timing.
      setTimeout(flush, 0);
    }

    function loadOne(index: number): Promise<void> {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = img.onerror = () => {
          loaded[index] = 1;
          while (frontier <= totalFrames && loaded[frontier]) frontier++;
          frontierRef.current = Math.max(1, frontier - 1);
          scheduleFlush();
          resolve();
        };
        img.src = frameSrc(index);
      });
    }

    async function worker(startIndex: number) {
      let index = startIndex;
      while (index <= totalFrames && !cancelled) {
        await loadOne(index);
        index += CONCURRENCY;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (cancelled || !entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        void Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1))).then(() => {
          if (!cancelled) setReady(true);
        });
      },
      { rootMargin },
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [containerRef, frameSrc, totalFrames, rootMargin, enabled]);

  return { progress, ready, frontierRef };
}
