"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, usePathname, useRouter, useSelectedLayoutSegments } from "next/navigation";
import type { ReactNode } from "react";
export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { collectionId, documentId } = useParams();
  const segments = useSelectedLayoutSegments();
  // 从路径中获取当前选中的标签
  const currentTab = segments[0] || "overview";

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
                    router.push(`/app/${collectionId}/deployments/${documentId}/${value}`);
                  }}
                >
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="api">API</TabsTrigger>
                    <TabsTrigger value="versions">Versions</TabsTrigger>
                    <TabsTrigger value="runs">Runs</TabsTrigger>
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
