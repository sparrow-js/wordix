import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="w-[100svw] md:w-[calc(100svw-60px)]">
      <div style={{ flex: "1 1 0px", overflow: "hidden" }}>
        <div className="flex h-full w-full md:w-auto flex-1 flex-col bg-muted/30">
          <div className="flex h-[60px] items-center justify-between border-b bg-background px-2 md:px-5 flex-shrink-0 pl-3">
            <div className="flex items-center gap-4 md:gap-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-base font-semibold">Deployments</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            {/* <div className="flex items-center gap-2">
              <Button className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-md">
                <Plus className="mr-2 h-4 w-4" />
                New Deployment
              </Button>
            </div> */}
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
