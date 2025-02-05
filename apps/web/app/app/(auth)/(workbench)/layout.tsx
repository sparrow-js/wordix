"use client";

import stores from "@/stores";
import { Provider } from "mobx-react";
import type { ReactNode } from "react";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <Provider {...stores}>{children}</Provider>;
}
