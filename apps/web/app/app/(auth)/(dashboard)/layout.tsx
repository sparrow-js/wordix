"use client";

import LeftSidebar from "@/components/app/left-side";
import TopBar from "@/components/layouts/top-bar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import stores from "@/stores";
import { Provider } from "mobx-react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  console.log("pathname", pathname, router);

  return (
    <Provider {...stores}>
      <div>
        <TopBar />
        <div className="flex h-[calc(100svh-60px)]">
          {pathname.includes("explore") ? (
            <div className="w-full h-full">{children}</div>
          ) : (
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={20}>
                <div className="w-full h-full">
                  <LeftSidebar />
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={80}>{children}</ResizablePanel>
            </ResizablePanelGroup>
          )}
        </div>
      </div>
    </Provider>
  );
}
