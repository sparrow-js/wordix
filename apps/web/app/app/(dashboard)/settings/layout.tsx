"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Key, Users } from "lucide-react";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const currentTab = segments[0] || "api-keys";

  return (
    <main className="flex h-[calc(100svh-120px)] overflow-hidden">
      <div
        className="flex h-full w-full data-[panel-group-direction=vertical]:flex-col"
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <div
          style={{
            flex: "1 1 0px",
            overflow: "hidden",
          }}
        >
          <div className="flex h-full overflow-y-auto">
            <div className="w-full px-1 py-4 md:p-5">
              <div className="flex w-full flex-col gap-5">
                <Tabs
                  value={currentTab}
                  onValueChange={(value) => {
                    router.push(`/app/settings/${value}`);
                  }}
                >
                  <TabsList>
                    <TabsTrigger value="api-keys">
                      <Key className="h-4 w-4 mr-2" />
                      API Keys
                    </TabsTrigger>
                    <TabsTrigger value="billing">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Billing
                    </TabsTrigger>
                    <TabsTrigger value="team">
                      <Users className="h-4 w-4 mr-2" />
                      Team
                    </TabsTrigger>
                    {/* <TabsTrigger value="usage">
                      <LineChart className="h-4 w-4 mr-2" />
                      Usage
                    </TabsTrigger> */}
                  </TabsList>
                </Tabs>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
