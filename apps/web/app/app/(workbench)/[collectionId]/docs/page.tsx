"use client";

import useStores from "@/hooks/useStores";
import type Collection from "@/models/Collection";
import { observer } from "mobx-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default observer(function DocsPage() {
  const { collections, documents, workspaces } = useStores();
  const { collectionId, id } = useParams<{ collectionId: string; id: string }>();

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
    const document = await documents.save(
      { title: "Untitled", collectionId: collectionId, workspaceId: workspaces.selectedWorkspaceId },
      { parentId },
    );
    await collection?.fetchDocuments({ force: true });
    router.push(`/app/${collectionId}/docs/${document.id}`);
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
                {/* 模板卡片1 */}
                <div
                  className="text-card-foreground border border-border card rounded-lg shadow w-[280px] cursor-pointer bg-transparent hover:bg-muted"
                  onClick={() => createDocument()}
                >
                  <div className="relative rounded-md p-6">
                    <div className="flex items-center">
                      <div className="w-full flex-auto space-y-1">
                        <p className="mb-2 truncate whitespace-nowrap text-sm font-medium leading-none text-muted-foreground">
                          Blank Flow
                        </p>
                        <p className="truncate whitespace-normal text-sm text-muted-foreground/50">
                          Start from scratch
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
