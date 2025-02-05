"use client";

import "./markdown.css";
import { Home } from "lucide-react";

export default function Page() {
  return (
    <main>
      <div>
        <a className="text-base-content cursor-pointer left-8 top-8 absolute" href="/">
          <Home />
        </a>
        <div className="max-w-3xl mx-auto leading-loose pt-4 pb-8 px-8">
          <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: 02.02.2025</p>

          <h4 className="text-2xl font-semibold mb-4">1. Subscription & Model Usage</h4>
          <p className="mb-6">
            Wordix provides an Integrated Development Environment (IDE) for building AI agents. Access is available
            through monthly subscription plans, including the Free (AI Tinkerer), $29 (AI Builder), and $299 (Company)
            tiers, as well as a custom Enterprise plan tailored to specific business needs. All plans include $1 of free
            usage. Additional usage costs will be charged based on the set spend limit.
          </p>

          <h4 className="text-2xl font-semibold mb-4">2. Refund Policy</h4>
          <p className="mb-6">
            Cancellations are immediate, and may be initiated either by the customer at any time, or by Wordix should we
            find the customer in violation of our{" "}
            <a href="/terms-of-service" className="text-blue-600 hover:underline">
              Terms of Service
            </a>
            . There are, as a general rule, no refunds for any portion of the subscription or usage costs. Wordix will,
            from time to make, make exceptions to this at our sole discretion.
          </p>

          <h4 className="text-2xl font-semibold mb-4">3. Cancellation Policy</h4>
          <p className="mb-6">
            Customers can cancel their subscriptions at any time through their account settings. Upon cancellation,
            access to the service is immediately terminated.
          </p>

          <h4 className="text-2xl font-semibold mb-4">4. Delivery Policy</h4>
          <p className="mb-6">
            Access to Wordix's services is delivered digitally immediately upon successful sign-up with an email and
            payment (if applicable). No physical goods are shipped.
          </p>

          <h4 className="text-2xl font-semibold mb-4">5. Return Policy</h4>
          <p className="mb-6">
            Returns are not applicable as Wordix provides digital services. However, we encourage customers to reach out
            to our support team for assistance with any issues or concerns.
          </p>
        </div>
      </div>
    </main>
  );
}
