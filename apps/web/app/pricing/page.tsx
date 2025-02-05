import { Pricing } from "@/components/landingpage/pricing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between py-6 px-20">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center">
              <img src="/logo200.png" alt="Logo" className="w-10 h-10 object-cover rounded-lg" />
            </div>
            <div className="text-xl font-bold text-gray-900">
              Word<span className="text-red-600">ix</span>
              <Badge className="bg-[#adfa1d] text-black ml-2">beta</Badge>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
              Home
            </Link>

            <div className="flex items-center space-x-4">
              <Link href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/login`}>
                <Button
                  variant="outline"
                  className="text-gray-900 hover:text-gray-700 transition-all duration-300 hover:scale-105"
                >
                  Sign in
                </Button>
              </Link>
              <Link href={process.env.NEXT_PUBLIC_APP_DOMAIN} prefetch={true}>
                <Button
                  variant="default"
                  className="bg-gray-900 hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                >
                  Try for free
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <div className="h-[88px]" />

      <div className="min-h-screen w-full px-20 mb-12">
        <div id="pricing" className="relative w-full h-full flex flex-col items-center py-14">
          <Pricing country="US" />
        </div>
      </div>

      <div className="flex justify-between items-center bg-black text-white p-8">
        <div className="flex items-center space-x-8">
          <div className="w-16 h-16">
            <img src="/logo-white-256.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <p className="text-gray-400 font-source-code-pro text-sm text-center">
            © 2025 Wordix, Inc.
            <br />
            All rights reserved.
          </p>
        </div>
        <div className="flex space-x-4">
          <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-200">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors duration-200">
            Terms of Service
          </Link>
          <Link href="/refund" className="text-gray-400 hover:text-white transition-colors duration-200">
            Refund Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
