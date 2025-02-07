"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export const PriceCards = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 font-['Fascinate_Inline']">Pricing plan</h1>
        <p className="text-gray-600">
          Quickly implement your ideas, start with Wordix, register for free and receive $1 experience.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col border-t-2 border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Free</h3>
          <p className="text-sm text-gray-600 mb-2">
            For enthusiasts and open source developers building modern AI agents and apps.
          </p>
          <div className="text-5xl font-bold mb-1">
            $0
            <span className="text-2xl font-normal">/mo</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">+$1 in free credits to try it out</span>
          </div>

          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">+2.5x in model usage after that</span>
          </div>

          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">Public workflows</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">cloud IDE</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">Basic pre-built tools</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">a public application</span>
          </div>
          <Link className="mt-auto w-full" href={process.env.NEXT_PUBLIC_APP_DOMAIN} prefetch={true}>
            <Button className="mt-auto w-full" variant="default">
              Get started
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col border-t-2 border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Exploring</h3>
          <p className="text-sm text-gray-600 mb-2">
            For businesses building AI workflows but not needing API deployment
          </p>
          <div className="text-5xl font-bold mb-1">
            $29
            <span className="text-2xl font-normal">/mo</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">+$10 of free credits/month</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">+1.5x in model usage after that</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">Private workflows</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">Private API deployment</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">cloud IDE</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">Full suite of tools</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">3 applications</span>
          </div>
          {/* <Link
            className="mt-auto w-full"
            href="https://app.wordix.so/checkout/pri_01jjdscat13f4skftt1qrs68jg"
            prefetch={true}
          > */}
          <Button
            className="mt-auto w-full"
            variant="default"
            onClick={() => {
              toast.success("coming soon!");
            }}
          >
            Get started
          </Button>
          {/* </Link> */}
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col border-t-2 border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-blue-500">Recommended</h3>
          <p className="text-sm text-gray-600 mb-2">
            For early stage businesses looking to build their infrastructure on Wordix{" "}
          </p>
          <div className="text-5xl font-bold mb-1">
            $299
            <span className="text-2xl font-normal">/mo</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">+$100 of free credits per month</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">+1.3x in modal usage after that</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">+3 seat incl. </span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">Private API deployment</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">500 API calls/day</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">10 applications</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">Everything in Workflows</span>
          </div>
          {/* <Link
            className="mt-auto w-full"
            href="https://app.wordix.so/checkout/pri_01jjdscat13f4skftt1qrs68jg"
            prefetch={true}
          > */}
          <Button
            className="mt-auto w-full"
            variant="default"
            onClick={() => {
              toast.success("coming soon!");
            }}
          >
            Get started
          </Button>
          {/* </Link> */}
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col border-t-2 border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-purple-500">Enterprise</h3>
          <p className="text-sm text-gray-600 mb-2">
            Empowering the Entire Organization with a Customized Advanced AI Toolkit
          </p>
          <div className="text-5xl font-bold mb-1">Custom</div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">Unlimited API calls/day</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600"> Standalone deployment</span>
          </div>
          <div className="flex items-center mb-4">
            <Check className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600"> Custom functions</span>
          </div>
          <Link className="mt-auto w-full" href="mailto:sparrowwht7@gmail.com">
            <Button className="mt-2 w-full" variant="outline">
              Chat with us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
