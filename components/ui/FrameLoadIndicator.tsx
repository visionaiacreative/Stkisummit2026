"use client";

export default function FrameLoadIndicator({ progress, visible }: { progress: number; visible: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center gap-2 text-ink/50">
        <div className="h-0.5 w-24 overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full bg-brand-red transition-[width] duration-150"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
}
