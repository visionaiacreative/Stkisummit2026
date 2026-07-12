"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";
import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel";

const PHOTO_COUNT = 13;
const photos = Array.from(
  { length: PHOTO_COUNT },
  (_, i) => `/carousel/photo-${String(i + 1).padStart(2, "0")}.jpg`
);

export default function GallerySection() {
  const { lang } = useLanguage();
  const t = content.gallery[lang];

  return (
    <section id="gallery" className="overflow-hidden bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-16">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} noWrapTitle />
      </div>

      <div dir="ltr" className="mt-10">
        <ThreeDPhotoCarousel cards={photos} />
      </div>
    </section>
  );
}
