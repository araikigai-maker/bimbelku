import { HeroSection } from "@/components/home/HeroSection";
import { ProgramsSection } from "@/components/home/ProgramsSection";
import { CatHighlightSection } from "@/components/home/CatHighlightSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { FaqSection } from "@/components/home/FaqSection";
import { PricingSection } from "@/components/home/PricingSection";
import { CtaSection } from "@/components/home/CtaSection";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <ProgramsSection />
      <CatHighlightSection />
      <FeaturesSection />
      <TestimonialSection />
      <FaqSection />
      <PricingSection />
      <CtaSection />
    </div>
  );
}
