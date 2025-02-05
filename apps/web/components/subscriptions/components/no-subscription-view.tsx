import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NoSubscriptionView() {
  return (
    <>
      <div className={"w-full"}>
        <Card
          className={"bg-background/50 backdrop-blur-[24px] border-border p-6 col-span-12 md:col-span-6 lg:col-span-4"}
        >
          <CardHeader className="p-0 space-y-0">
            <CardTitle className="flex justify-between items-center pb-2">
              <span className={"text-xl font-medium"}>No active subscriptions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className={"p-0"}>
            <div className="text-base leading-6">Sign up for a subscription to see your subscriptions here.</div>
          </CardContent>
          {/* <CardFooter className={"p-0 pt-6"}>
            <Button asChild={true} size={"sm"} variant={"outline"} className={"text-sm rounded-sm border-border"}>
              <Link href={"/"}>View all</Link>
            </Button>
          </CardFooter> */}
        </Card>
      </div>
    </>
  );
}
