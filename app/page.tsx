import ImpactIntro from "@/components/sections/ImpactIntro";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import AudienceSection from "@/components/sections/AudienceSection";
import TechTalkSection from "@/components/sections/TechTalkSection";
import GallerySection from "@/components/sections/GallerySection";
import SponsorshipSection from "@/components/sections/SponsorshipSection";
import InfoGridSection from "@/components/sections/InfoGridSection";
import EventDetailsBar from "@/components/sections/EventDetailsBar";
import VisionCredit from "@/components/sections/VisionCredit";

export default function Home() {
  return (
    <main>
      <ImpactIntro />
      <HeroSection />
      <AboutSection />
      <AudienceSection />
      <TechTalkSection />
      <GallerySection />
      <SponsorshipSection />
      <InfoGridSection />
      <EventDetailsBar />
      <div className="h-3 bg-paper shadow-[0_0_18px_rgba(255,255,255,0.5)]" />
      <VisionCredit />
    </main>
  );
}
