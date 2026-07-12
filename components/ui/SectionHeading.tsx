"use client";

import { motion } from "framer-motion";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "start" | "center";
  noWrapTitle?: boolean;
  bodyClassName?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  body,
  align = "start",
  noWrapTitle = false,
  bodyClassName = "max-w-4xl text-lg leading-relaxed text-ink/60 md:text-xl [text-align:justify]",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center mx-auto" : "text-start";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`flex flex-col gap-4 ${alignClass}`}
    >
      {eyebrow && (
        <span className="text-sm font-semibold tracking-[0.2em] text-brand-red uppercase">
          {eyebrow}
        </span>
      )}
      <h2
        className={
          noWrapTitle
            ? "text-2xl leading-tight font-medium text-ink whitespace-normal sm:text-3xl md:whitespace-nowrap lg:text-4xl"
            : "heading max-w-2xl text-ink"
        }
      >
        {title}
      </h2>
      {body && <p className={bodyClassName}>{body}</p>}
    </motion.div>
  );
}
