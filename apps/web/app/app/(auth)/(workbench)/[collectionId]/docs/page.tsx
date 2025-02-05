"use client";

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

  const createDocument = async (parentId?: string) => {
    if (isSaving) return;
    setIsSaving(true);
    const document = await documents.save(
      { title: "Untitled", collectionId: collectionId, workspaceId: workspaces.selectedWorkspaceId },
      { parentId },
    );
    await collection?.fetchDocuments({ force: true });
    setIsSaving(false);
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

              <div className="card-container flex flex-wrap justify-center gap-4">
                <div
                  onClick={() => createDocument()}
                  className="bg-[#fff] border border-[#f1f0f0] rounded-lg p-6 flex flex-col items-center text-center hover:ring-1 hover:ring-[#fad400] shadow w-[280px] h-[106px] flex justify-center"
                >
                  {isSaving ? (
                    <LoadingCircle dimensions="h-4 w-4" />
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold mb-2"> Blank Flow</h2>
                      <p className="text-gray-800 text-sm">Start from scratch</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
