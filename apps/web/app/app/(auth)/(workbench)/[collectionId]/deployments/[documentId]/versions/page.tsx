"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useStores from "@/hooks/useStores";
import { PAGINATION_SYMBOL } from "@/stores/base/const";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function VersionsPage() {
  const { collectionId, documentId } = useParams<{ collectionId: string; documentId: string }>();
  const [ref, inView] = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { revisions } = useStores();
  const publishedRevisions = revisions.publishedInDocument(documentId);

  const fetchRuns = async (page: number) => {
    setIsLoading(true);
    const res = await revisions.fetchPage({
      limit: 25,
      page: page,
      collectionId: collectionId as string,
      documentId: documentId as string,
      visibility: "published",
      sort: "updatedAt",
    });
    if (res[PAGINATION_SYMBOL].total <= revisions.publishedList.length) {
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
    <div className="border bg-card text-card-foreground shadow-sm h-full rounded-md">
      <div className="flex flex-col gap-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Versions</h3>
      </div>
      <div className="p-6 pt-0 h-full" data-sentry-element="CardContent" data-sentry-source-file="VersionsView.tsx">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Release Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publishedRevisions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                      <p>No Versions found</p>
                      <p>When you execute flows, they will appear here</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                publishedRevisions.map((revision) => (
                  <TableRow key={revision.id}>
                    <TableCell>
                      <div>{revision.version}</div>
                    </TableCell>
                    <TableCell>{revision.title}</TableCell>
                    <TableCell>{formatDistanceToNow(revision.updatedAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div ref={ref} style={{ height: "1px" }} />
      </div>
    </div>
  );
}
