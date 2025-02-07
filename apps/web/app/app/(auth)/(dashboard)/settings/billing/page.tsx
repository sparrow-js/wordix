import { Pricing } from "@/components/landingpage/pricing";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default async function BillingPage() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-10 p-4">
      <div className="grid items-start pb-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>beta</AlertTitle>
          <AlertDescription>Beta testing phase - Free access during this period</AlertDescription>
        </Alert>
        <div className="max-w-6xl">
          <Pricing country="US" />
        </div>
      </div>
    </div>
  );
}
