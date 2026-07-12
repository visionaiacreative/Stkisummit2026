import Image from "next/image";

type WordmarkProps = {
  variant?: "dark" | "onRed";
  size?: "md" | "lg";
  className?: string;
};

const sizeClasses: Record<string, string> = {
  md: "h-9 w-auto md:h-10",
  lg: "h-12 w-auto md:h-14",
};

const textSizeClasses: Record<string, string> = {
  md: "text-xl",
  lg: "text-3xl md:text-4xl",
};

export default function Wordmark({ variant = "dark", size = "md", className = "" }: WordmarkProps) {
  if (variant === "onRed") {
    return (
      <span dir="ltr" className={`font-extrabold lowercase text-white ${textSizeClasses[size]} ${className}`}>
        stki<span className="text-white/60">.</span>info
      </span>
    );
  }

  return (
    <span className={className}>
      <Image
        src="/stki-logo-transparent.png"
        alt="STKI - IT Knowledge Integrators"
        width={480}
        height={245}
        className={sizeClasses[size]}
        priority
      />
    </span>
  );
}
