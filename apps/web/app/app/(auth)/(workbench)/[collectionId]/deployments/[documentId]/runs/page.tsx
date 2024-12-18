"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useStores from "@/hooks/useStores";
import { PAGINATION_SYMBOL } from "@/stores/base/const";
import { formatDistanceToNow } from "date-fns";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default observer(function RunsPage() {
  const { collectionId, documentId } = useParams<{ collectionId: string; documentId: string }>();
  const [ref, inView] = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { runs } = useStores();
  const publishedRuns = runs.publishedInCollection(collectionId);

  const fetchRuns = async (page: number) => {
    setIsLoading(true);
    const res = await runs.fetchPage({
      limit: 25,
      page: page,
      collectionId: collectionId as string,
      documentId: documentId as string,
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
    <div className="w-full rounded-lg border border-border bg-background">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Version</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {publishedRuns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                    <p>No runs found</p>
                    <p>When you execute flows, they will appear here</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              publishedRuns.map((run) => (
                <TableRow key={run.id} className="cursor-pointer">
                  <TableCell>{run.user?.name || "-"}</TableCell>
                  <TableCell>{run.organization?.name || "-"}</TableCell>
                  <TableCell>
                    <span data-state="closed">{formatDistanceToNow(run.updatedAt)}</span>
                  </TableCell>
                  <TableCell>
                    <span>{run.duration || "-"}s</span>
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 w-fit">
                      {run.version || "1.0"}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div ref={ref} style={{ height: "1px" }} />
    </div>
  );
});
