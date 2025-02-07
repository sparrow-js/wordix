"use client";

import { PriceCards } from "@/components/landingpage/price-cards";

interface Props {
  country: string;
}

export function Pricing({ country }: Props) {

  return (
    <div className="mx-auto max-w-7xl relative px-[32px] flex flex-col items-center justify-between">
      <PriceCards />
    </div>
  );
}
