"use client";

import { getCoolHueImage } from "@/components/coolhue";
import LoadingCircle from "@/components/icons/loading-circle";
import RunApp from "@/components/run-app";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import useStores from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { CollectionPermission } from "@prisma/client";

export default function ExplorePage() {
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [templateList, setTemplateList] = useState<any[]>([]);
  const [accordionValues, setAccordionValues] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [document, setDocument] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);

  const { collections, workspaces, documents } = useStores();
  const router = useRouter();

  const fetchTemplateList = async () => {
    setLoading(true);
    const template = await fetch("/api/documents/template-collection", {
      method: "POST",
      body: JSON.stringify({
        collections: [
          {
            title: "deepseek 提示词库",
            id: "a95184f6-3bdd-4c63-b118-664135d7d7df",
          },
          {
            title: "Claude 集合",
            id: "b2cb9790-6326-4796-be32-e5343f0cb598",
          },
          {
            title: "办公",
            id: "76dc3b3a-cb5b-4148-98e5-17743daf5030",
          },
          {
            title: "神棍算命",
            id: "2c3d8d8b-db34-489f-8e93-428fcfa2eaf7",
          },
        ],
      }),
    });

    const res = await template.json();
    if (res.data) {
      setTemplateList(res.data);
      setAccordionValues(res.data.map((item: any) => item.id));
    }
    setLoading(false);
  };

  const fetchTemplate = async () => {
    const template = await fetch("/api/documents/template", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await template.json();
    if (res.data) {
      setTemplate(res.data);
    }
  };

  const createDocument = async (collectionId: string, parentId?: string, template?: any) => {
    const document = await documents.save(
      {
        title: template?.title,
        collectionId: collectionId,
        workspaceId: workspaces.selectedWorkspaceId,
        content: template?.content,
        bannerImage: getCoolHueImage(),
      },
      { parentId },
    );
    router.push(`/${collectionId}/docs/${document.id}`);
  };

  const handleCopy = async () => {
    setIsCopying(true);
    const collection = await collections.save({
      name: document.title,
      privacy: "public" as CollectionPermission,
      workspaceId: workspaces.selectedWorkspaceId,
      bannerImage: getCoolHueImage(),
    });

    await createDocument(collection.id, undefined, {
      title: document.title,
      content: document.content,
    });
    setIsCopying(false);
  };

  useEffect(() => {
    fetchTemplate();
    fetchTemplateList();
  }, []);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20}>
        <div className="w-full h-full p-4">
          <h2 className="text font-bold mt-2">类别</h2>
          <div className="h-[calc(100svh-100px)] overflow-y-auto">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <div className="pl-4 space-y-2">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <Skeleton key={j} className="h-8 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Accordion type="multiple" className="w-full" defaultValue={accordionValues} value={accordionValues}>
                {templateList.map((item) => {
                  return (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger>{item.title}</AccordionTrigger>
                      <AccordionContent>
                        {item.list.map((doc) => {
                          return (
                            <div
                              key={doc.id}
                              className={cn(
                                "px-4 py-2 hover:bg-accent rounded-md cursor-pointer flex items-center gap-2",
                                selectedTemplate?.id === doc.id && "bg-accent",
                              )}
                              onClick={() => {
                                setSelectedTemplate(doc);
                              }}
                            >
                              <img
                                className="rounded-md"
                                src={doc.bannerImage}
                                alt={doc.title}
                                width={20}
                                height={20}
                              />
                              {doc.title}
                            </div>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={80}>
        <div className="w-full h-full">
          <div className="flex h-full w-full md:w-auto flex-1 flex-col bg-muted/30">
            <div className="flex h-[60px] items-center justify-between border-b bg-background px-2 md:px-5 flex-shrink-0">
              <div className="flex items-center gap-4 md:gap-2">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <h1 className="sr-only">explore</h1>
                      <BreadcrumbPage className="text-base font-semibold">Explore</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              {selectedTemplate && (
                <Button onClick={handleCopy}>
                  {isCopying ? <LoadingCircle dimensions="h-4 w-4 mr-2" /> : <Rocket className="w-4 h-4" />}
                  Copy your own version
                </Button>
              )}
            </div>
            <div className="flex h-[calc(100svh-120px)] overflow-y-auto">
              {selectedTemplate ? (
                <RunApp documentId={selectedTemplate?.id} onDocumentChange={(doc) => setDocument(doc)} />
              ) : (
                <div className="flex items-center justify-center w-full text-muted-foreground">
                  {template ? (
                    <ScrollArea className="h-full w-full">
                      <div
                        className="h-full w-full rounded-[inherit] [&>div]:!block"
                        style={{ overflow: "hidden scroll" }}
                      >
                        <div style={{ minWidth: "100%", display: "table" }}>
                          <div className="px-1 py-4 md:p-5">
                            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                              {template.map((document) => {
                                return (
                                  <div
                                    key={document.id}
                                    className="flex flex-col border border-border rounded-lg overflow-hidden shadow-md hover:ring-1 hover:ring-[#fad400]"
                                    onClick={() => {
                                      setSelectedTemplate(document);
                                    }}
                                  >
                                    <div
                                      className="relative h-24 w-full bg-cover bg-center"
                                      style={{
                                        backgroundImage: `url(${document.bannerImage || "/placeholder.png"})`,
                                      }}
                                    >
                                      <div className="absolute bottom-0 left-0 translate-y-1/2 translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-muted-foreground text-background">
                                        {document.title.slice(0, 1).toUpperCase()}
                                      </div>
                                    </div>
                                    <div className="flex flex-col p-3 text-start">
                                      <p className="text-[16px] leading-[20px] font-bold mt-2 line-clamp-2 h-[40px]">
                                        {document.title}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(document.updatedAt)}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-2xl font-bold">No template selected</h1>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
