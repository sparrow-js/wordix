import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-10 p-4">
      <div className="grid items-start gap-8 pb-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>beta</AlertTitle>
          <AlertDescription>Beta testing phase - Free access during this period</AlertDescription>
        </Alert>
        <div className="flex items-center justify-between px-2">
          <div className="grid gap-1">
            <h1 className="text-3xl font-bold md:text-4xl">Billing</h1>
            <p className="text-lg text-muted-foreground">Subscribe to get to the next level.</p>
          </div>
        </div>

        <div className="max-w-6xl">
          <div className="mx-auto max-w-lg text-center lg:max-w-xl xl:max-w-3xl"></div>
          <div className="pricing-lists grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {/* Plan 1 */}
            <div className="flex w-full flex-col gap-4 rounded-lg border p-4">
              <div
                className="w-min whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium"
                style={{ color: "rgb(4, 120, 87)", backgroundColor: "rgba(4, 120, 87, 0.082)" }}
              >
                free
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">Builder</h3>
                <p className="text-lg font-light text-muted-foreground">
                  For enthusiasts and open source devs building modern AI agents and apps.
                </p>
              </div>
              <div className="flex items-start py-2">
                <div className="text-2xl font-bold tracking-tighter">$</div>
                <div className="flex items-end gap-1.5">
                  <span className="text-6xl font-semibold tracking-tighter">0</span>
                  <span className="pb-2 text-xl font-light text-muted-foreground">/mo</span>
                </div>
              </div>
              <div className="flex min-h-20 flex-col gap-1">
                <div className="text-xs text-muted-foreground">+$5 in free credits per month</div>
                <div className="text-xs text-muted-foreground">+2.5x in model usage after that</div>
              </div>
              <div className="my-4 flex flex-col gap-2">
                <a
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 text-center"
                  href="https://checkout.stripe.com/c/pay/cs_live_b14M2X..."
                >
                  Get Started
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 text-center"
                  href="https://app.wordware.ai/book"
                >
                  Chat with us
                </a>
              </div>
              <div>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Public workflows</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Public API deployment</span>
                  </li>
                </ul>
                <hr className="my-4 border-t" />
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Unlimited API requests</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Basic pre-built tools</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Exotic models</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Unlimited access to templates</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Plan 5 */}
            <div className="flex w-full flex-col gap-4 rounded-lg border p-4">
              <div
                className="w-min whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium"
                style={{ color: "rgb(50, 162, 225)", backgroundColor: "rgba(50, 162, 225, 0.082)" }}
              >
                Compliance
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">Enterprise</h3>
                <p className="text-lg font-light text-muted-foreground">
                  For empowering entire organisations with an advanced AI toolkit
                </p>
              </div>
              <span className="py-2 text-4xl font-semibold tracking-tighter md:text-6xl">Custom</span>
              <div className="flex min-h-20 flex-col gap-1"></div>
              <div className="my-4 flex flex-col gap-2">
                <a
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 text-center"
                  href="https://app.wordware.ai/book"
                >
                  Chat with us
                </a>
              </div>
              <div>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0" />

                    <span>Unlimited API calls/day</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>SOC 2, HIPAA, ISO compliance, geo-fencing options</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>White glove onboarding for the whole team</span>
                  </li>
                </ul>
                <hr className="my-4 border-t" />
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>
                      3 person forward deployed engineering team helping with integrations and set-up of new workflows
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Bi-monthly workshops for executives with AI industry-specific updates by founders</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Audit trails</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Tailored evaluation custom-built for your use case</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Our founders on SMS/WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Everything in scaling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
