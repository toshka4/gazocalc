import { FAQ_ITEMS } from "@/data/constants";

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const WEB_APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Калькулятор газобетона онлайн",
  description:
    "Бесплатный онлайн-калькулятор газобетона для расчёта количества газобетонных блоков, расхода клея для кладки, числа поддонов и стоимости строительства стен.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "RUB",
  },
  inLanguage: "ru",
  browserRequirements: "Requires JavaScript",
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Главная",
      item: "https://gazocalc.ru/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Калькулятор газобетона",
      item: "https://gazocalc.ru/#calculator",
    },
  ],
};

export function SeoJsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEB_APP_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }}
      />
    </>
  );
}
