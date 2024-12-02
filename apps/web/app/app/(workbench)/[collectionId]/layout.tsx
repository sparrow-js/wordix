"use client";

import TopBar from "@/components/layouts/top-bar";
import { VerticalTabBar } from "@/components/layouts/vertical-tab-bar";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <TopBar />
      <div className="flex h-[calc(100svh-60px)]">
        <VerticalTabBar />
        <div className="w-full">{children}</div>
      </div>
      <Toaster />
    </div>
  );
}
