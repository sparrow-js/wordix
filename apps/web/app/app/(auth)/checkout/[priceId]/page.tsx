import { CheckoutGradients } from "@/components/gradients/checkout-gradients";
import "@/styles/checkout.css";
import { CheckoutContents } from "@/components/checkout/checkout-contents";
import { CheckoutHeader } from "@/components/checkout/checkout-header";
// import { useSession } from "next-auth/react";
import { auth } from "@/lib/auth";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  return (
    <div className={"w-full min-h-screen relative overflow-hidden"}>
      <CheckoutGradients />
      <div
        className={"mx-auto max-w-6xl relative px-[16px] md:px-[32px] py-[24px] flex flex-col gap-6 justify-between"}
      >
        <CheckoutHeader />
        <CheckoutContents userEmail={session?.user?.email} />
      </div>
    </div>
  );
}
