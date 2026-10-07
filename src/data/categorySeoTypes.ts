export interface CategorySeoItem {
  slug: string;
  path: string;
  name: string;
  navTitle: string;
  title: string;
  metaDescription: string;
  canonical: string;
  h1: string;
  badge: string;
  intro: string;
  searchIntentSummary: string;
  whatIs: {
    title: string;
    description: string;
    highlights: string[];
  };
  whereUsed: {
    title: string;
    items: { name: string; desc: string }[];
  };
  howToMeasure: {
    title: string;
    steps: { step: number; title: string; desc: string }[];
    toleranceTip: string;
  };
  howToInstall: {
    title: string;
    steps: { step: number; title: string; desc: string }[];
  };
  installationCautions: {
    title: string;
    points: { title: string; desc: string; isWarning?: boolean }[];
  };
  whyGlassCracks: {
    title: string;
    summary: string;
    thermalExpansionExplanation: string;
    overtighteningExplanation: string;
    gasketExplanation: string;
    preventionRules: string[];
  };
  priceCalculationInfo: {
    title: string;
    explanation: string;
    standardThickness: string;
    steps: string[];
  };
  visuals: {
    product: { title: string; alt: string; desc: string; tag: string };
    measure: { title: string; alt: string; desc: string; tag: string };
    install: { title: string; alt: string; desc: string; tag: string };
    application: { title: string; alt: string; desc: string; tag: string };
    correctVsIncorrect: {
      correctAlt: string;
      correctDesc: string;
      incorrectAlt: string;
      incorrectDesc: string;
    };
  };
  faqs: { question: string; answer: string }[];
  relatedCategorySlugs: string[];
}
