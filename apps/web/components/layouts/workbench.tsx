"use client";

import TailwindAdvancedEditor from "@/components/advanced-editor";
import PageBar from "@/components/layouts/page-bar";
import useStores from "@/hooks/useStores";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const Workbench = () => {
  const { workbench, documents, inputsNode } = useStores();
  const { id } = useParams<{ id: string }>();
  const [response, setResponse] = useState<any>();

  useEffect(() => {
    inputsNode.setDocumentId(id);

    async function fetchData() {
      try {
        setResponse((state) => ({
          ...state,
          document: undefined,
        }));

        const res = await documents.fetchWithSharedTree(id, {
          // shareId,
        });
        setResponse(res);
      } catch (err) {
        // setError(err);
      }
    }
    void fetchData();

    return () => {
      const document = documents.get(id);

      document?.save({
        content: document.content,
      });
    };
  }, [documents, id]);

  return (
    <div className="flex h-full w-full flex-col relative">
      <div className="w-full h-full">
        <PageBar />
        <div className="w-full h-[calc(100svh-120px)]">
          {response && response.document && <TailwindAdvancedEditor response={response} />}
        </div>
      </div>
    </div>
  );
};

export default observer(Workbench);
