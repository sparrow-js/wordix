"use client";

import { ErrorContent } from "@/components/subscriptions/components/error-content";
import { LoadingScreen } from "@/components/subscriptions/components/loading-screen";
import { SubscriptionHeader } from "@/components/subscriptions/components/subscription-header";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { SubscriptionDetailResponse, TransactionResponse } from "@/utils/paddle/api.types";
import { getSubscription } from "@/utils/paddle/get-subscription";
import { getTransactions } from "@/utils/paddle/get-transactions";
import { useEffect, useState } from "react";

interface Props {
  subscriptionId: string;
}

export function SubscriptionDetail({ subscriptionId }: Props) {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionDetailResponse>();
  const [transactions, setTransactions] = useState<TransactionResponse>();
  const { toast } = useToast();
  useEffect(() => {
    (async () => {
      const [subscriptionResponse, transactionsResponse] = await Promise.all([
        getSubscription(subscriptionId),
        getTransactions(subscriptionId, ""),
      ]);

      if (subscriptionResponse) {
        setSubscription(subscriptionResponse);
      }

      if (transactionsResponse) {
        setTransactions(transactionsResponse);
      }
      setLoading(false);
    })();
  }, [subscriptionId]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (subscription?.data && transactions?.data) {
    return (
      <>
        <div>
          <SubscriptionHeader subscription={subscription.data} />
          <Separator className={"relative bg-border mb-8 dashboard-header-highlight"} />
        </div>
      </>
    );
  }

  return <ErrorContent />;
}
