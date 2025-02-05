"use client";

import { Provider } from "mobx-react";
import type { ReactNode } from "react";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>;
}
