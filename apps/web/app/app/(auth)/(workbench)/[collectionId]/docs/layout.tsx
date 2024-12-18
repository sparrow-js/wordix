import { type ReactNode } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable";
  import Directory from "@/components/directory";
export default function DashboardLayout({ children }: { children: ReactNode }) {

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20}>
                <div className="w-full h-full">
                    <Directory />
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={80}>
                {children}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}