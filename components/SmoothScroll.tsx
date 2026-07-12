"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Browsers restore the previous scroll position on refresh by default,
    // which flashes whatever pinned section that position mapped to (e.g. the
    // desktop frame sequence) before anything here has a chance to run. Force
    // every load to start at the top instead.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    let rafId = requestAnimationFrame(raf);

    (window as typeof window & { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as typeof window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}

export function scrollToTarget(target: number | HTMLElement) {
  const lenis = (window as typeof window & { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6 });
  } else if (typeof target !== "number") {
    target.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
}

export function pauseSmoothScroll() {
  (window as typeof window & { __lenis?: Lenis }).__lenis?.stop();
}

export function resumeSmoothScroll() {
  (window as typeof window & { __lenis?: Lenis }).__lenis?.start();
}
