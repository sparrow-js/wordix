"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useStores from "@/hooks/useStores";
import { PAGINATION_SYMBOL } from "@/stores/base/const";
import { observer } from "mobx-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { v4 as uuidv4 } from "uuid";

import { cn } from "@/lib/utils";

import DebugExecute from "@/components/settings/execute/debug-execute";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, ChevronsRight, MoreHorizontal } from "lucide-react";

export default observer(function RunsPage() {
  const router = useRouter();
  const { collectionId } = useParams<{ collectionId: string }>();

  const [ref, inView] = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { runs, execute, workbench } = useStores();
  const publishedRuns = runs.publishedInCollection(collectionId);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const fetchRuns = async (page: number) => {
    setIsLoading(true);
    const res = await runs.fetchPage({
      limit: 25,
      page: page,
      collectionId: collectionId as string,
      visibility: "published",
      sort: "updatedAt",
    });
    if (res[PAGINATION_SYMBOL].total <= runs.publishedList.length) {
      setHasMore(false);
    } else {
      setPage(page + 1);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      fetchRuns(page);
    }
  }, [inView]);

  return (
    <main className="w-[100svw] md:w-[calc(100svw-60px)]">
      <div className="flex h-full w-full">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "100%",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <div style={{ flex: "1 1 0px", overflow: "hidden" }}>
            <div className="flex h-full w-full md:w-auto flex-1 flex-col bg-muted/30">
              <div className="flex h-[60px] items-center justify-between border-b bg-background px-2 md:px-5 flex-shrink-0 pl-3">
                <div className="flex items-center gap-4 md:gap-2">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink className="text-foreground text-base font-semibold">Runs</BreadcrumbLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </div>
              <div className="flex h-[calc(100svh-120px)] overflow-hidden">
                <ResizablePanelGroup direction="horizontal">
                  <ResizablePanel defaultSize={50}>
                    <div style={{ flex: "100 1 0px", overflow: "hidden" }}>
                      <div className="flex h-full overflow-y-auto">
                        <div className="w-full px-1 py-4 md:p-5">
                          <div className="w-full rounded-lg border border-border bg-background">
                            <div className="relative w-full overflow-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableCell className="w-12 p-4">
                                      <div className="flex items-center justify-center overflow-hidden rounded-md h-8 w-8" />
                                    </TableCell>
                                    <TableHead className="pl-2">Flow</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>State</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableCell className="w-12 p-4">
                                      <div />
                                    </TableCell>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {publishedRuns.map((run) => (
                                    <TableRow
                                      key={run.id}
                                      className={cn(
                                        "cursor-pointer font-semibold",
                                        selectedRunId === run.id && "bg-muted/80",
                                      )}
                                      onClick={() => {
                                        setSelectedRunId(run.id);
                                        workbench.setShowRunDetails();
                                        console.log(run);
                                        execute.setInjectChatList([
                                          {
                                            id: uuidv4(),
                                            content: run.metadata.markdownOutput,
                                            isAnswer: true,
                                          },
                                        ]);
                                      }}
                                    >
                                      <TableCell className="w-12 p-4">
                                        <div className="flex items-center justify-center overflow-hidden rounded-md h-8 w-8" />
                                      </TableCell>
                                      <TableCell>
                                        <span className="max-w-28">{run.document?.title}</span>
                                      </TableCell>
                                      <TableCell>
                                        <span className="cursor-default">{formatDistanceToNow(run.updatedAt)}</span>
                                      </TableCell>
                                      <TableCell>
                                        <span className="ml-2 flex min-w-10 cursor-pointer items-center">
                                          <CheckCircle className="mr-2 h-4 w-4 text-muted-foreground/50" />
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        <span className="w-[500px]">-s</span>
                                      </TableCell>
                                      <TableCell className="w-12 p-4">{/* ... existing button code ... */}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </div>
                        <div style={{ height: "1px" }} ref={ref} />
                      </div>
                    </div>
                  </ResizablePanel>
                  <ResizableHandle />
                  {workbench.showRunDetails && (
                    <ResizablePanel defaultSize={50}>
                      <div className="flex h-full flex-col bg-background">
                        <div className="flex h-10 items-center border-b border-border px-1">
                          <div className="grid w-full grid-cols-3 items-center text-sm font-semibold text-muted-foreground">
                            <div className="justify-self-start">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  workbench.setHideRunDetails();
                                }}
                              >
                                <ChevronsRight className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-self-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-muted-foreground/50" />
                              Runner: <span className="ml-1 max-w-32 truncate font-normal">Hello world 👋🌍</span>
                            </div>
                            <div className="justify-self-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground p-2 rounded-md aspect-square h-8 w-8"
                                    type="button"
                                  >
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Go to flow</DropdownMenuItem>
                                  <DropdownMenuItem>Go to run</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                        <div className="flex h-full w-full">
                          <DebugExecute injectChatList={execute.injectChatList} />
                        </div>
                      </div>
                    </ResizablePanel>
                  )}
                </ResizablePanelGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
});
