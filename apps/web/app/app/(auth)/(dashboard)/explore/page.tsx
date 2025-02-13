"use client";

import { getCoolHueImage } from "@/components/coolhue";
import LoadingCircle from "@/components/icons/loading-circle";
import RunApp from "@/components/run-app";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import useStores from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import { Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { CollectionPermission } from "@prisma/client";

export default function ExplorePage() {
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [templateList, setTemplateList] = useState<any[]>([]);
  const [accordionValues, setAccordionValues] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [document, setDocument] = useState<any>(null);

  const { collections, workspaces, documents } = useStores();
  const router = useRouter();

  const fetchTemplate = async () => {
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
  }, []);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20}>
        <div className="w-full h-full p-2">
          <h2 className="text font-bold mt-2">类别</h2>
          <div className="h-[calc(100svh-100px)] overflow-y-auto">
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
                            <img src={doc.bannerImage} alt={doc.title} width={20} height={20} />
                            {doc.title}
                          </div>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
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
                  Please select a template from the left
                </div>
              )}
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
