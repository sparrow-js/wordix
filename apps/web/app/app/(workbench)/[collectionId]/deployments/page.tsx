"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useStores from "@/hooks/useStores";
import { PAGINATION_SYMBOL } from "@/stores/base/const";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function DeploymentsPage() {
  const router = useRouter();
  const { collectionId } = useParams<{ collectionId: string }>();

  const [ref, inView] = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { documents } = useStores();
  const publishedDocuments = documents.publishedInCollection(collectionId);

  const fetchDocuments = async (page: number) => {
    setIsLoading(true);
    const res = await documents.fetchPage({
      limit: 25,
      page: page,
      collectionId: collectionId as string,
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
    <div className="flex h-[calc(100svh-120px)] overflow-hidden">
      <div className="flex h-full w-full data-[panel-group-direction=vertical]:flex-col">
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full overflow-y-auto">
            <div className="w-full px-1 py-4 md:p-5">
              <div className="w-full rounded-lg border border-border bg-background">
                <div className="relative w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell className="w-12">
                          <div className="flex items-center justify-center overflow-hidden rounded-md h-6 w-6" />
                        </TableCell>
                        <TableHead className="pl-2">Name</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Access</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {publishedDocuments.map((document) => (
                        <TableRow
                          key={document.id}
                          className="cursor-pointer"
                          onClick={() => {
                            router.push(`/${collectionId}/deployments/${document.id}/overview`);
                          }}
                        >
                          <TableCell className="w-12">
                            <div className="flex items-center justify-center overflow-hidden rounded-md h-6 w-6">
                              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200">
                                <div
                                  style={{
                                    position: "relative",
                                    width: "100%",
                                    paddingBottom: "100%",
                                  }}
                                >
                                  <div
                                    style={{
                                      position: "absolute",
                                      inset: "0px",
                                    }}
                                  >
                                    <img alt="Banner image" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="pl-2">{document.title}</TableCell>
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
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            <div style={{ height: "1px" }} ref={ref} />
          </div>
        </div>
      </div>
    </div>
  );
}
