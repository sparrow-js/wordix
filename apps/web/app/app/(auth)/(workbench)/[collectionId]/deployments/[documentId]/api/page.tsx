"use client";
import { Button } from "@/components/ui/button";
import useStores from "@/hooks/useStores";
import type Document from "@/models/Document";
import { Copy, DollarSign } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OverviewPage() {
  const { documentId, collectionId } = useParams<{ documentId: string; collectionId: string }>();
  const { documents } = useStores();
  const [document, setDocument] = useState<Document | null>(null);
  const [inputList, setInputList] = useState<any[]>([]);
  const [bodyString, setBodyString] = useState<string>("");

  useEffect(() => {
    async function fetchDocument() {
      const doc = await documents.fetchWithSharedTree(documentId);
      setDocument(doc.document);

      const inputsNode = doc.document.content?.content.find((c) => c.type === "inputs");
      if (inputsNode) {
        const inputsNodeContent = inputsNode.content || [];
        setInputList(inputsNodeContent);
        setBodyString(
          `{"inputs": { ${inputsNodeContent
            .map((input) => `"${input.attrs.label}":"<${input.attrs.type}_value>"`)
            .join(",")}}, "version":"${doc.document?.documentVersion}"}`,
        );
      }
    }
    fetchDocument();
  }, [documentId]);

  return (
    <div className="flex items-start gap-5 pb-20">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex-1">
        {/* API Section */}
        <div className="flex flex-col gap-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">API</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-bold">URL</h2>
              <div className="flex flex-col rounded-md border border-border">
                <div className="flex items-center justify-between px-2 text-primary text-xs py-2">
                  <span className="flex items-center gap-2.5 text-xs">
                    <code>{`/api/released-app/${document?.id || "documentId"}/run`}</code>
                  </span>
                  <Button
                    onClick={() => navigator.clipboard.writeText(`/api/released-app/${document?.id}/run`)}
                    variant="ghost"
                    size="icon"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-bold">Request Body</h2>
              <p>
                You have to pass two parameters to the request body: <span className="text-orange-300">inputs</span> and{" "}
                <span className="text-orange-300">version</span>.
              </p>

              {/* Inputs Section */}
              <div className="flex flex-col gap-2">
                <h3 className="text-md font-bold">Inputs</h3>
                <p>These are the inputs for this WordApp:</p>
                <ul className="list-inside list-disc">
                  {inputList.map((input) => {
                    return (
                      <li key={input.id}>
                        {input.attrs.label} <span className="text-gray-400">({input.attrs.type})</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Version Section */}
              <div className="flex flex-col gap-2">
                <h3 className="text-md font-bold">Version</h3>
                <p>
                  We use a simplified semantic versioning. All versions follow the format{" "}
                  <span className="text-orange-300">&lt;major&gt;.&lt;minor&gt;</span>, for example{" "}
                  <span className="text-orange-300">1.0</span>.
                </p>
                <p>
                  You have to pass the version number you want to use. You can use the caret syntax like this to get the
                  latest non-breaking version: <span className="text-orange-300">^1.0</span>. We recommend you use this
                  syntax when you build your APIs. Example:
                </p>
                <div className="flex flex-col rounded-md border border-border">
                  <div className="flex items-center justify-between px-2 text-primary text-xs py-2">
                    <span className="flex items-center gap-2.5 text-xs">
                      <code>{`{"version": "${document?.documentVersion}"}`}</code>
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigator.clipboard.writeText(`{"version": "${document?.documentVersion}"}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Complete Body Section */}
              <div className="flex flex-col gap-2">
                <h3 className="text-md font-bold">Complete Body</h3>
                <p>The whole request body looks like this:</p>
                <pre className="whitespace-pre-wrap">
                  <div className="flex flex-col rounded-md border border-border">
                    <div className="flex items-center justify-between px-2 text-primary text-xs py-2">
                      <span className="flex items-center gap-2.5 text-xs">
                        <code>{`{
  "inputs": {
  ${inputList.map((input) => `  "${input.attrs.label}": "<${input.attrs.type}_value>"`).join(",\n  ")}
  },
  "version": "${document?.documentVersion}"
}`}</code>
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          navigator.clipboard.writeText(`{
                          "inputs": {
                            "name": "<text_value>",
                            "style": "<text_value>"
                          },
                          "version": "^1.0"
                        }`)
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex-1">
        <div className="flex flex-col gap-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Testing</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-bold">Setup</h2>
              <p>
                To get started, export your API key in your terminal. You can generate a key{" "}
                <Link className="text-sky-400" target="_blank" rel="noopener noreferrer" href="/settings/api-keys">
                  here
                </Link>
                .
              </p>
              <p>You can then export it from your terminal:</p>
              <div className="flex flex-col rounded-md border border-border">
                <div className="flex items-center justify-between px-2 text-primary text-xs py-2">
                  <span className="flex items-center gap-2.5 text-xs">
                    <DollarSign className="h-4 w-4" />
                    <code>export WORDIX_API_KEY=&lt;your_api_key&gt;</code>
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigator.clipboard.writeText("export WORDIX_API_KEY=&lt;your_api_key&gt;")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* cURL Section */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold">cURL</h2>
              <p>Use this cURL command to send your request:</p>
              <div className="flex flex-col rounded-md border border-border">
                <div className="flex items-center justify-between px-2 text-primary text-xs py-2">
                  <span className="flex items-center gap-2.5 text-xs">
                    <DollarSign className="h-4 w-4" />
                    <code>curl -X POST /api/released-app/{document?.id || "documentId"}/run</code>
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `
curl -X POST /api/released-app/${document?.id}/run 
-H "Authorization: Bearer $WORDIX_API_KEY" 
-d '${bodyString}'`,
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between px-2 text-primary text-xs py-2 ml-11">
                  <code>-H "Authorization: Bearer $WORDIX_API_KEY"</code>
                </div>
                <div className="flex items-center justify-between px-2 text-primary text-xs py-2 ml-11">
                  <code>{`-d \'${bodyString}\'`}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      ;
    </div>
  );
}
