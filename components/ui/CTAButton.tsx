"use client";

type CTAButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "onDark";
  className?: string;
};

export default function CTAButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
}: CTAButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide transition-transform duration-300 hover:scale-105 md:text-base";

  const variants: Record<string, string> = {
    primary: "bg-brand-red text-white hover:bg-brand-red-dark",
    secondary: "border border-ink/20 text-ink hover:border-brand-red hover:text-brand-red",
    onDark: "bg-white text-brand-red hover:bg-white/90",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    const isExternalLink = !href.startsWith("mailto:") && !href.startsWith("tel:");
    return (
      <a
        href={href}
        target={isExternalLink ? "_blank" : undefined}
        rel={isExternalLink ? "noopener noreferrer" : undefined}
        onClick={onClick}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
