"use client";

import { Button } from "@/components/ui/button";
import useStores from "@/hooks/useStores";
import type Document from "@/models/Document";
import { ChevronRight, Copy, ExternalLink, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OverviewPage() {
  const { documentId, collectionId } = useParams<{ documentId: string; collectionId: string }>();
  const { documents } = useStores();
  const [document, setDocument] = useState<Document | null>(null);

  useEffect(() => {
    async function fetchDocument() {
      const doc = await documents.fetchWithSharedTree(documentId);
      setDocument(doc.document);
    }
    fetchDocument();
  }, [documentId]);

  const deploymentLink = `/explore/apps/${documentId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + deploymentLink);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="flex gap-4">
      {/* Info Card */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex-1">
        {/* Card Header */}
        <div className="flex items-start justify-between p-6">
          <div className="mt-1 flex flex-1 flex-col gap-1.5">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Info</h3>
          </div>
          <div className="flex gap-2">
            <Link href={`/${collectionId}/deployments/${documentId}/edit`}>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        {/* Card Content */}
        <div className="p-6 pt-0">
          <div className="flex flex-col gap-6">
            {/* Link */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Link
              </label>
              <div className="flex items-center justify-between gap-1 rounded-md border px-2 py-2 text-xs border-blue-300 bg-blue-100 text-blue-400">
                <Link href={`/explore/apps/${documentId}`}>
                  <span className="flex items-center gap-2.5 truncate">
                    <code>/explore/apps/{documentId}</code>
                  </span>
                </Link>

                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8 border-blue-300" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Link href={deploymentLink} target="_blank">
                    <Button variant="outline" size="icon" className="h-8 w-8 border-blue-300">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            {/* Visibility */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Visibility
              </label>
              <div className="border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent flex w-fit items-center gap-1 rounded-sm bg-green-50 text-green-700 hover:bg-green-50">
                {document?.visibility}
              </div>
            </div>
            {/* Banner Image */}
            <div className="flex flex-col gap-2 max-w-[400px]">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Banner Image
              </label>
              <div
                data-radix-aspect-ratio-wrapper=""
                style={{ position: "relative", width: "100%", paddingBottom: "20%" }}
              >
                <div className="mt-2 bg-muted" style={{ position: "absolute", inset: 0 }}>
                  <img
                    alt="App banner"
                    className="rounded-md object-cover"
                    sizes="100vw"
                    src="/coolHue-81FBB8-28C76F.png"
                    style={{
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                      inset: 0,
                      color: "transparent",
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Title
              </label>
              <p className="text-sm">{document?.title}</p>
            </div>
            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Description
              </label>
              <div className="flex w-full gap-2">
                <h3 className="text-sm whitespace-pre-wrap font-light text-muted-foreground">
                  {document?.description}
                  <Button variant="link" className="ml-2 h-auto p-0">
                    Show more
                  </Button>
                </h3>
              </div>
            </div>
            {/* Active Version */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Active Version
              </label>
              <div className="inline-flex items-center rounded-full border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 w-fit py-0">
                {document?.documentVersion}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Files Card */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-fit w-[500px] shrink-0">
        {/* Card Header */}
        <div className="flex flex-col gap-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Files</h3>
        </div>
        {/* Card Content */}
        <div className="p-6 pt-0">
          <div className="flex flex-col gap-6">
            {/* Entrypoint */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Entrypoint
              </label>
              <Link href={`/${collectionId}/docs/${documentId}`}>
                <div className="h-[36px] items-center rounded cursor-pointer justify-between flex w-full border-border border bg-[#FAFAFA] dark:bg-muted px-2.5 gap-8">
                  <div className="flex items-center gap-2 text-sm font-medium">{document?.title}</div>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            </div>
            {/* Sub-flows */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Sub-flows
              </label>
              <p className="text-sm text-muted-foreground">This deployment doesn't use any subflows</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
