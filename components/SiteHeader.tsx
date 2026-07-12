"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Wordmark from "@/components/ui/Wordmark";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/lib/content";
import { scrollToTarget } from "@/components/SmoothScroll";

export default function SiteHeader() {
  const { lang } = useLanguage();
  const t = content.nav[lang];
  const [showLogo, setShowLogo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const intro = document.getElementById("intro");
    if (!intro) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowLogo(!entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(intro);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function handleNavClick(id: string) {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;

    const header = document.querySelector("header");
    const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 0;
    const visibleHeight = window.innerHeight - headerHeight;
    const rect = el.getBoundingClientRect();

    const offset =
      rect.height < visibleHeight
        ? headerHeight + (visibleHeight - rect.height) / 2
        : headerHeight + 24;

    scrollToTarget(window.scrollY + rect.top - offset);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        className="absolute inset-0 border-b border-ink/8 bg-paper/85 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: showLogo ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <div className="relative flex items-center px-4 py-2.5 md:px-6">
        <div className="hidden md:block">
          <LanguageToggle />
        </div>

        <motion.button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
          animate={
            showLogo
              ? { opacity: 1, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, scale: 0.9, filter: "blur(6px)" }
          }
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-[5px] rounded-full border border-ink/15 bg-paper md:hidden"
        >
          <motion.span
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6.5 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-[1.5px] w-4 rounded-full bg-ink"
          />
          <motion.span
            animate={{ opacity: menuOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="h-[1.5px] w-4 rounded-full bg-ink"
          />
          <motion.span
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6.5 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-[1.5px] w-4 rounded-full bg-ink"
          />
        </motion.button>

        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: showLogo ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="hidden flex-1 items-center justify-center gap-6 overflow-x-auto md:flex"
        >
          {t.links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="shrink-0 text-sm font-medium whitespace-nowrap text-ink/60 transition-colors hover:text-brand-red"
            >
              {link.label}
            </button>
          ))}
        </motion.nav>

        <div className="flex flex-1 justify-end md:flex-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
            animate={
              showLogo
                ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                : { opacity: 0, scale: 0.9, filter: "blur(6px)" }
            }
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Wordmark size="lg" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 top-[52px] -z-10 bg-ink/20 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-x-0 top-full border-b border-ink/8 bg-paper shadow-[0_12px_24px_rgba(0,0,0,0.06)] md:hidden"
            >
              <nav className="flex flex-col gap-1 px-4 py-4">
                {t.links.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className="rounded-lg px-3 py-3 text-start text-base font-medium text-ink/70 transition-colors hover:bg-ink/5 hover:text-brand-red"
                  >
                    {link.label}
                  </button>
                ))}
                <div className="mt-2 flex justify-start border-t border-ink/8 px-3 pt-4">
                  <LanguageToggle />
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
