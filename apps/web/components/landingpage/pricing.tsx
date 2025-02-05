"use client";

import { PriceCards } from "@/components/landingpage/price-cards";
import { type Environments, type Paddle, initializePaddle } from "@paddle/paddle-js";
import { useEffect, useState } from "react";
import { BillingFrequency, type IBillingFrequency } from "./billing-frequency";
import { usePaddlePrices } from "./usePaddlePrices";

interface Props {
  country: string;
}

export function Pricing({ country }: Props) {
  const [frequency, setFrequency] = useState<IBillingFrequency>(BillingFrequency[0]);
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);

  const { prices, loading } = usePaddlePrices(paddle, country);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && process.env.NEXT_PUBLIC_PADDLE_ENV) {
      initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
      }).then((paddle) => {
        if (paddle) {
          setPaddle(paddle);
        }
      });
    }
  }, []);

  return (
    <div className="mx-auto max-w-7xl relative px-[32px] flex flex-col items-center justify-between">
      <PriceCards frequency={frequency} loading={loading} priceMap={prices} />
    </div>
  );
}
