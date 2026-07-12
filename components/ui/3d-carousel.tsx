"use client";

import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type UseMediaQueryOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === "undefined";

function useMediaQuery(
  query: string,
  { defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query);
    }
    return defaultValue;
  });

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);
    const handleChange = () => setMatches(getMatches(query));
    handleChange();

    matchMedia.addEventListener("change", handleChange);
    return () => matchMedia.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

const AUTO_ROTATE_DEGREES_PER_SECOND = 6;
const transition = { duration: 0.15, ease: [0.32, 0.72, 0, 1] as const };

const Carousel = memo(({ cards }: { cards: string[] }) => {
  const isScreenSizeSm = useMediaQuery("(max-width: 640px)", {
    initializeWithValue: false,
  });
  const faceCount = cards.length;
  const faceWidth = isScreenSizeSm ? 158 : 255;
  const cylinderWidth = faceWidth * faceCount;
  const radius = cylinderWidth / (2 * Math.PI);
  const degreesPerPixel = 360 / cylinderWidth;

  const rotation = useMotionValue(0);
  const transform = useTransform(
    rotation,
    (value) => `rotate3d(0, 1, 0, ${value}deg)`
  );
  const isDragging = useRef(false);

  useAnimationFrame((_, delta) => {
    if (isDragging.current) return;
    rotation.set(rotation.get() + (AUTO_ROTATE_DEGREES_PER_SECOND * delta) / 1000);
  });

  return (
    <div
      className="flex h-full items-center justify-center"
      style={{
        perspective: "1400px",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <motion.div
        drag="x"
        dragElastic={0.06}
        dragMomentum={false}
        className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
        style={{
          transform,
          rotateY: rotation,
          width: cylinderWidth,
          transformStyle: "preserve-3d",
        }}
        onDragStart={() => {
          isDragging.current = true;
        }}
        onDrag={(_, info) =>
          rotation.set(rotation.get() + info.delta.x * degreesPerPixel)
        }
        onDragEnd={() => {
          isDragging.current = false;
        }}
      >
        {cards.map((imgUrl, i) => (
          <div
            key={`key-${imgUrl}-${i}`}
            className="absolute flex h-full origin-center items-center justify-center p-2"
            style={{
              width: `${faceWidth}px`,
              transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
            }}
          >
            <motion.img
              src={imgUrl}
              alt=""
              className="pointer-events-none w-full rounded-2xl border border-ink/10 object-cover shadow-lg aspect-[4/3]"
              initial={{ filter: "blur(4px)" }}
              animate={{ filter: "blur(0px)" }}
              transition={transition}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
});
Carousel.displayName = "Carousel";

export function ThreeDPhotoCarousel({ cards }: { cards: string[] }) {
  return (
    <div className="relative h-[195px] w-full overflow-hidden sm:h-[225px] md:h-[285px]">
      <Carousel cards={cards} />
    </div>
  );
}
