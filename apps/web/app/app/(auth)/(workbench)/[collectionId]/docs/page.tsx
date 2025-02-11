"use client";

import { getCoolHueImage } from "@/components/coolhue";
import LoadingCircle from "@/components/icons/loading-circle";
import useStores from "@/hooks/useStores";
import type Collection from "@/models/Collection";
import { observer } from "mobx-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default observer(function DocsPage() {
  const { collections, documents, workspaces } = useStores();
  const { collectionId, id } = useParams<{ collectionId: string; id: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const [templateId, setTemplateId] = useState("");
  const [templateList, setTemplateList] = useState([]);

  const [collection, setCollection] = useState<Collection | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCollection = async () => {
      if (collectionId) {
        try {
          const collection = await collections.fetch(collectionId);
          setCollection(collection);
        } finally {
        }
      }
    };
    fetchCollection();
  }, [collectionId]);

  const fetchTemplate = async () => {
    const template = await fetch("/api/documents/template", {
      method: "POST",
      body: JSON.stringify({ collectionId }),
    });

    const res = await template.json();
    if (res.data) {
      setTemplateList(res.data);
    }
  };

  useEffect(() => {
    fetchTemplate();
  }, []);

  const createDocument = async (parentId?: string, template?: any) => {
    if (isSaving) return;
    setIsSaving(true);
    setTemplateId(template?.id);
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
    await collection?.fetchDocuments({ force: true });
    setIsSaving(false);
    setTemplateId("");
    router.push(`/${collectionId}/docs/${document.id}`);
  };

  return (
    <div className="flex h-full overflow-y-auto">
      <div className="w-full px-1 py-4 md:p-5">
        <div className="flex w-full sm:min-w-[300px] md:min-w-[450px] lg:min-w-[600px]">
          <div>
            <div className="m-6">
              {/* 模板部分 */}
              {/* <div className="mb-6 mt-12 flex w-full justify-center">
                <div className="mx-auto text-sm font-semibold uppercase text-muted-foreground">
                  Start from a Template
                </div>
              </div> */}

              <div className="card-container flex flex-wrap gap-4">
                <div
                  onClick={() => createDocument()}
                  className="bg-[#fff] border border-[#f1f0f0] rounded-lg p-6 flex flex-col items-center text-center hover:ring-1 hover:ring-[#fad400] shadow w-[280px] h-[106px] flex justify-center"
                >
                  {isSaving && !templateId ? (
                    <LoadingCircle dimensions="h-4 w-4" />
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold mb-2"> Blank Flow</h2>
                      <p className="text-gray-800 text-sm">Start from scratch</p>
                    </>
                  )}
                </div>
                {templateList.map((item) => (
                  <div
                    onClick={() => createDocument(undefined, item)}
                    className="bg-[#fff] border border-[#f1f0f0] rounded-lg p-6 flex flex-col items-center text-center hover:ring-1 hover:ring-[#fad400] shadow w-[280px] h-[106px] flex justify-center"
                  >
                    {isSaving && templateId === item.id ? (
                      <LoadingCircle dimensions="h-4 w-4" />
                    ) : (
                      <>
                        <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                        <p className="text-gray-800 text-sm">{item.description}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
