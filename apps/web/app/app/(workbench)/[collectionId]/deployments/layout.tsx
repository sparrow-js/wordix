import { type ReactNode } from "react";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <main className="w-[100svw] md:w-[calc(100svw-60px)]">
            <div
              style={{ flex: '1 1 0px', overflow: 'hidden' }}
            >
                <div className="flex h-full w-full md:w-auto flex-1 flex-col bg-muted/30">
                    <div className="flex h-[60px] items-center justify-between border-b bg-background px-2 md:px-5 flex-shrink-0 pl-3">
                        <div
                            className="flex items-center gap-4 md:gap-2"
                        >
                            <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                <BreadcrumbPage className="text-base font-semibold">
                                    Deployments
                                </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                            className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-md"
                            disabled
                            data-state="closed"
                            style={{ pointerEvents: 'auto' }}
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-plus mr-2 h-4 w-4"
                            >
                                <path d="M5 12h14"></path>
                                <path d="M12 5v14"></path>
                            </svg>
                            New Deployment
                            </button>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </main>
    )
}