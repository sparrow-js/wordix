export interface Tier {
  name: string;
  id: "starter" | "pro" | "advanced";
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: Record<string, string>;
}

export const PricingTier: Tier[] = [
  {
    name: "Pro",
    id: "pro",
    icon: "/assets/icons/price-tiers/basic-icon.svg",
    description: "For businesses building AI workflows but not needing API deployment",
    features: [
      "+$10 of free credits/month",
      "+1.5x in model usage after that",
      "Private workflows",
      "Private API deployment",
      "Cloud IDE",
      "Full suite of tools",
    ],
    featured: true,
    priceId: { month: "pri_01jjdscat13f4skftt1qrs68jg", year: "pri_01jjgza2sy7e6m1v3h5zewv20r" },
  },
];
