import { lazy, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/layout/HeroSection";
import { AdvantagesSection } from "@/components/layout/AdvantagesSection";
import { CalculatorForm } from "@/components/calculator/CalculatorForm";
import { ResultsBlock } from "@/components/calculator/ResultsBlock";
import { SeoJsonLd } from "@/components/seo/SeoJsonLd";
import { useCalculator } from "@/hooks/useCalculator";

// Ленивая загрузка компонентов ниже первого экрана
const LeadForm = lazy(() => import("@/components/lead-form/LeadForm").then(m => ({ default: m.LeadForm })));
const RecommendationsSection = lazy(() => import("@/components/recommendations/RecommendationsSection").then(m => ({ default: m.RecommendationsSection })));
const FaqSection = lazy(() => import("@/components/layout/FaqSection").then(m => ({ default: m.FaqSection })));
const SeoTextSection = lazy(() => import("@/components/layout/SeoTextSection").then(m => ({ default: m.SeoTextSection })));
const Footer = lazy(() => import("@/components/layout/Footer").then(m => ({ default: m.Footer })));
const MobileCta = lazy(() => import("@/components/layout/MobileCta").then(m => ({ default: m.MobileCta })));

function App() {
  const calc = useCalculator();

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <SeoJsonLd />
      <Header />
      <main>
        <HeroSection />
        <AdvantagesSection />
        <CalculatorForm
          input={calc.input}
          isCustomBlock={calc.isCustomBlock}
          setField={calc.setField}
          setBlockPreset={calc.setBlockPreset}
          setCustomBlock={calc.setCustomBlock}
          enableCustomBlock={calc.enableCustomBlock}
          onReset={calc.reset}
        />
        <ResultsBlock result={calc.result} />
        <Suspense fallback={<div className="min-h-[200px]" />}>
          <LeadForm
            calculatorInput={calc.input}
            calculatorResult={calc.result}
          />
          <RecommendationsSection />
          <FaqSection />
          <SeoTextSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
        <MobileCta />
      </Suspense>
    </div>
  );
}

export default App;
