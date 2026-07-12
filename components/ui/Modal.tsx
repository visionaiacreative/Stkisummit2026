"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { pauseSmoothScroll, resumeSmoothScroll } from "@/components/SmoothScroll";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
};

export default function Modal({ open, onClose, title, children, wide = false }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    pauseSmoothScroll();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      resumeSmoothScroll();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.98 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            className={`relative max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-paper p-8 shadow-2xl sm:rounded-3xl sm:p-10 ${
              wide ? "max-w-2xl" : "max-w-lg"
            }`}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-5 end-5 flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/40 transition-colors hover:border-brand-red hover:text-brand-red"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <h3 className="heading pe-10 text-ink">{title}</h3>
            <div className="mt-6 flex flex-col gap-5 text-start">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
