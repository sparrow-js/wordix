'use client'

import { type ReactNode, Suspense } from "react";
import { VerticalTabBar } from "@/components/layouts/vertical-tab-bar";
import TopBar from "@/components/layouts/top-bar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <TopBar />
      <div className="flex h-[calc(100svh-60px)]">
        <VerticalTabBar />
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}