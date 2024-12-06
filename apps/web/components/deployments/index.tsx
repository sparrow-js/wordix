"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useStores from "@/hooks/useStores";
import { PAGINATION_SYMBOL } from "@/stores/base/const";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
export default function Page() {
  const [ref, inView] = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { documents } = useStores();
  const router = useRouter();
  const fetchDocuments = async (page: number) => {
    setIsLoading(true);
    const res = await documents.fetchPage({
      limit: 25,
      page: page,
      visibility: "published",
      sort: "publishedAt",
    });
    if (res[PAGINATION_SYMBOL].total <= documents.publishedList.length) {
      setHasMore(false);
    } else {
      setPage(page + 1);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      fetchDocuments(page);
    }
  }, [inView]);

  return (
    <div className="flex h-full w-full md:w-auto flex-1 flex-col bg-muted/30">
      <div className="flex h-[60px] items-center justify-between border-b bg-background px-2 md:px-5 flex-shrink-0">
        <div className="flex items-center gap-4 md:gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-base font-semibold">Deployments</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="flex h-[calc(100svh-120px)] overflow-hidden">
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
              flexBasis: 0,
              flexGrow: 1,
              flexShrink: 1,
              overflow: "hidden",
            }}
          >
            <div className="flex h-full">
              <div className="w-full p-0">
                <div dir="ltr" className="relative overflow-hidden h-full w-full">
                  <ScrollArea className="h-full">
                    <div className="px-1 py-4 md:p-5">
                      <div className="w-full rounded-lg border border-border bg-background">
                        <div className="relative w-full overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableCell className="w-12">
                                  <div className="flex items-center justify-center overflow-hidden rounded-md h-6 w-6" />
                                </TableCell>
                                <TableHead className="pl-2">Name</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Runs</TableHead>
                                <TableHead>Version</TableHead>
                                <TableHead>Access</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {documents.publishedList.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={6} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                      <p className="text-sm text-muted-foreground">No deployments found</p>
                                      <p className="text-xs text-muted-foreground">
                                        Create a deployment to get started
                                      </p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                documents.publishedList.map((document) => (
                                  <TableRow
                                    className="cursor-pointer"
                                    key={document.id}
                                    onClick={() => {
                                      router.push(`/app/${document.collectionId}/deployments/${document.id}/overview`);
                                    }}
                                  >
                                    <TableCell>
                                      <div className="flex items-center justify-center overflow-hidden rounded-md h-6 w-6">
                                        {/* ... existing image code ... */}
                                      </div>
                                    </TableCell>
                                    <TableCell className="pl-2">{document.title}</TableCell>
                                    <TableCell>{document.collection?.name}</TableCell>
                                    <TableCell>0</TableCell>
                                    <TableCell>
                                      <div className="inline-flex items-center rounded-full border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 w-fit py-0">
                                        {document.version}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent flex w-fit items-center gap-1 rounded-sm bg-green-50 text-green-700 hover:bg-green-50">
                                        {document.visibility}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                      <div style={{ height: "1px" }} ref={ref} />
                      <div className="py-4 text-center opacity-60">
                        <p className="text-sm text-muted-foreground">No more items to load</p>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
