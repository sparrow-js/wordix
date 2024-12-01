'use client'

import { type ReactNode } from "react";
import { Provider } from "mobx-react";
import stores from "@/stores";
export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <Provider {...stores}>
            {children}
        </Provider>
    );
}