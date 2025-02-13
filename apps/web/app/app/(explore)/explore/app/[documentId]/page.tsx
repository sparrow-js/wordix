"use client";
import { Copy, StopCircle, X } from "lucide-react";
import { useParams } from "next/navigation";
import { type DropEvent, type FileRejection, useDropzone } from "react-dropzone";

// import Markdown from "react-markdown";
import { Markdown } from "@/components/base/markdown";
import DescriptionEditor from "@/components/description-editor";
import LoadingDots from "@/components/icons/loading-dots";
import InputUploadImage from "@/components/input-upload-image";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ssePost } from "@/service/base";
import { client } from "@/utils/ApiClient";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { toast } from "sonner";

const onUpload = async (file: File) => {
  const promise = fetch("/api/upload", {
    method: "POST",
    headers: {
      "content-type": file?.type || "application/octet-stream",
      "x-vercel-filename": encodeURIComponent(file?.name || "image.png"),
    },
    body: file,
  });

  return new Promise((resolve, reject) => {
    toast.promise(
      promise.then(async (res) => {
        if (res.status === 200) {
          const { url } = (await res.json()) as { url: string };
          const image = new Image();
          image.src = url;
          image.onload = () => {
            resolve(url);
          };
        } else if (res.status === 401) {
          resolve(file);
          throw new Error("`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.");
        } else {
          throw new Error("Error uploading image. Please try again.");
        }
      }),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully.",
        error: (e) => {
          reject(e);
          return e.message;
        },
      },
    );
  });
};

export default function ExplorePage() {
  const { documentId } = useParams<{ documentId: string }>();
  const [markdownGen, setMarkdownGen] = useState("");
  const contentRef = useRef("");
  const [inputList, setInputList] = useState<any[]>([]);
  const [inputValues, setInputValues] = useState<any>({});
  const [title, setTitle] = useState("");
  const [descriptionDoc, setDescriptionDoc] = useState<any>(null);
  const [documentDoc, setDocumentDoc] = useState<any>(null);
  const [collectionId, setCollectionId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [runList, setRunList] = useState<any[]>([]);
  const [userRunList, setUserRunList] = useState<any[]>([]);
  const [runDrawerOpen, setRunDrawerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadedDocument, setIsLoadedDocument] = useState(false);
  const [document, setDocument] = useState(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const dropzoneConfig = {
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
      if (acceptedFiles.length > 0) {
        try {
          const url = await onUpload(acceptedFiles[0]);
          setImageUrl(url as string);
          const currentInputId = (event.target as HTMLElement).id;
          setInputValues((prev) => ({ ...prev, [currentInputId]: url }));
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    },
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneConfig);

  const fetchDocument = async () => {
    const res = await client.get(`/released-app/getAppPublic/${documentId}`, {});
    setIsLoadedDocument(true);
    if (res.data) {
      const content = res.data.content;
      setDocumentDoc(content);
      setCollectionId(res.data.collectionId);
      setDocument(res.data);
      // Parse inputs from content
      const inputsNode = content.content.find((node: any) => node.type === "inputs");
      if (inputsNode?.content) {
        const inputs = inputsNode.content.map((input: any) => ({
          id: input.attrs.id,
          type: input.attrs.type,
          label: input.attrs.label,
          description: input.attrs.description,
        }));

        setInputValues(
          inputs.reduce((acc, input) => {
            acc[input.id] = "";
            return acc;
          }, {}),
        );
        setInputList(inputs);
      }
      setTitle(res.data.title);
      const descriptionNode = content.content.find((node: any) => node.type === "description");

      const descriptionDoc = {
        type: "doc",
        content: [descriptionNode],
      };
      setDescriptionDoc(descriptionDoc);
    } else {
      setErrorMessage(res.message);
    }
  };

  const fetchRunList = async () => {
    const res = await client.get("/released-app/getRunList/", {
      documentId,
      limit: 25,
      page: 0,
    });
    if (res.data) {
      setRunList(res.data.runs);
      setUserRunList(res.data.userRuns);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const generatePrompt = async () => {
    contentRef.current = "";
    setIsLoading(true);

    ssePost(
      "/api/released-app/run",
      {
        body: {
          inputs: inputValues,
          documentFlow: documentDoc,
          documentId,
          collectionId,
        },
      },
      {
        isPublicAPI: true,
        onData: (
          message: string,
          isFirstMessage: boolean,
          { conversationId: newConversationId, messageId, taskId }: any,
        ) => {
          contentRef.current += message; // 同步更新 ref
          setMarkdownGen(contentRef.current);
        },
        onCompleted: () => {
          setIsLoading(false);
          fetchRunList();
          // @ts-ignore
          // const docSize = window.editor?.state.doc.content.size;
          // 使用 ref 的当前值，保证是最新的
          // @ts-ignore
          // window.editor?.commands.insertContentAt(docSize, contentRef.current);
        },
        onWorkflowStarted: () => {
          setMarkdownGen("");
        },
        getAbortController: (abortController) => {
          abortControllerRef.current = abortController;
        },
        onError: (error) => {
          setIsLoading(false);
          setRunDrawerOpen(false);
          toast.error(error);
          console.error("Error generating prompt:", error);
        },
      },
    );
  };

  useEffect(() => {
    fetchDocument();
    fetchRunList();
  }, [documentId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [markdownGen]);

  return (
    <main className="flex-grow w-full min-h-screen">
      <div
        className="h-[90vh] w-full"
        style={{
          backgroundImage: `url(${document?.bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between py-6 px-20">
            <Link href="https://www.wordix.so/">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center">
                  <img src="/logo200.png" alt="Logo" className="w-10 h-10 object-cover rounded-lg" />
                </div>
                <div className="text-xl font-bold text-gray-900">
                  Word<span className="text-red-600">ix</span>
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="text-gray-900 hover:text-gray-700 transition-all duration-300 hover:scale-105"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="default"
                    className="bg-gray-900 hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                  >
                    Try for free
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
        {isLoadedDocument && (
          <div>
            {errorMessage ? (
              <div className="text-center text-red-500 py-36 text-2xl">{errorMessage}</div>
            ) : (
              <>
                <div className="w-full relative overflow-hidden pt-16">
                  <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row space-y-12 md:space-y-0 md:space-x-12 relative">
                    <div className="w-full md:w-1/2 flex flex-col items-center justify-center md:-mt-12 px-12 pt-20">
                      <div className="text-left">
                        <p className="text-5xl font-semibold leading-tight md:leading-snug lg:leading-normal">
                          {title}
                        </p>
                        {descriptionDoc && <DescriptionEditor initialContent={descriptionDoc} />}
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 space-y-12 relative h-[80vh] flex items-center justify-center">
                      <div className="w-[70%] mx-auto">
                        <div className="text-card-foreground shadow-sm border-0 relative bg-opacity-80 backdrop-blur-md rounded-lg p-8 text-center transition-colors">
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-100 to-gray-300 -z-10" />
                          <div className="absolute inset-[1px] rounded-lg bg-gradient-to-r from-gray-100 to-gray-300 bg-opacity-80 backdrop-blur-md -z-10" />
                          <div className="relative z-0 max-h-[45vh] overflow-y-auto px-2">
                            {inputList.map((input) => {
                              if (input.type === "image") {
                                return (
                                  <div key={input.id} className="mb-6 flex flex-col gap-2 justify-start items-start">
                                    <Label>{input.description}</Label>
                                    <InputUploadImage
                                      onChange={(value) => {
                                        setInputValues({ ...inputValues, [input.id]: value });
                                      }}
                                    />
                                  </div>
                                );
                              }

                              if (input.type === "text") {
                                return (
                                  <div key={input.id} className="mb-6 flex flex-col gap-2 justify-start items-start">
                                    <Label>{input.description}</Label>
                                    <Input
                                      value={inputValues[input.id]}
                                      onChange={(e) => {
                                        setInputValues({ ...inputValues, [input.id]: e.target.value });
                                      }}
                                    />
                                  </div>
                                );
                              }

                              if (input.type === "longText") {
                                return (
                                  <div key={input.id} className="mb-6 flex flex-col gap-2 justify-start items-start">
                                    <Label>{input.description}</Label>
                                    <Textarea
                                      value={inputValues[input.id]}
                                      onChange={(e) => {
                                        setInputValues({ ...inputValues, [input.id]: e.target.value });
                                      }}
                                    />
                                  </div>
                                );
                              }

                              return <div key={input.id} />;
                            })}
                          </div>
                          <div className="relative">
                            <Button
                              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-none transition-all duration-300"
                              onClick={() => {
                                contentRef.current = "";
                                setMarkdownGen("");
                                setRunDrawerOpen(true);
                                generatePrompt();
                              }}
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                Generate
                                <Sparkles className="w-5 h-5 ml-1" />
                              </span>
                            </Button>
                            <Drawer open={runDrawerOpen} onOpenChange={setRunDrawerOpen} repositionInputs={false}>
                              {/* <DrawerTrigger asChild>
                        <Button
                          className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-none transition-all duration-300"
                          onClick={() => {
                            generatePrompt();
                          }}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            Generate
                            <Sparkles className="w-5 h-5 ml-1" />
                          </span>
                        </Button>
                      </DrawerTrigger> */}
                              <DrawerContent className="h-[82vh] py-8">
                                {isLoading && (
                                  <div className="flex absolute top-[24px] right-[50%]">
                                    <LoadingDots />
                                  </div>
                                )}

                                <div ref={scrollRef} className="mx-auto w-full px-24 relative h-full overflow-y-auto">
                                  <div className="p-4 select-text flex flex-col items-center">
                                    <Markdown className="prose lg:prose-xl w-full" content={markdownGen} />
                                  </div>
                                </div>
                                <DrawerClose asChild className="absolute right-4 top-4">
                                  <Button variant="outline" size="icon">
                                    <X className="w-4 h-4" />
                                  </Button>
                                </DrawerClose>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="absolute right-16 top-4"
                                  onClick={() => {
                                    navigator.clipboard.writeText(markdownGen);
                                    toast.success("Content copied to clipboard");
                                  }}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                                {isLoading && (
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute right-28 top-4 bg-red-500 hover:bg-red-600 text-white"
                                    onClick={() => {
                                      handleStop();
                                    }}
                                  >
                                    <StopCircle className="w-4 h-4" />
                                  </Button>
                                )}
                              </DrawerContent>
                            </Drawer>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 bg-gray-50 py-16">
                  <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6">
                    {userRunList.length > 0 && (
                      <div className="flex flex-col gap-6">
                        <h2 className="text-3xl font-semibold text-gray-900">My Results</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {userRunList.map((run) => (
                            <div
                              key={run.id}
                              className="group relative flex flex-col overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300"
                            >
                              <div className="flex-1 p-6">
                                <div className="group relative">
                                  <div className="h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                    <Markdown
                                      content={run?.metadata.markdownOutput}
                                      className="prose prose-sm max-w-none 
                                        prose-headings:font-semibold prose-headings:text-gray-900 
                                        prose-p:text-gray-600 prose-strong:text-gray-900 
                                        prose-code:text-gray-900"
                                    />
                                  </div>
                                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-white/60 to-white opacity-0 transition-all duration-200 group-hover:opacity-100">
                                    <Button
                                      variant="default"
                                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 
                                        hover:scale-105 hover:shadow-xl"
                                      onClick={() => {
                                        setRunDrawerOpen(true);
                                        setMarkdownGen(run?.metadata.markdownOutput);
                                      }}
                                    >
                                      View Details
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <p
                                        className="line-clamp-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900"
                                        onClick={() => {
                                          const content = run.inputValues
                                            ? (Object.values(run.inputValues) as string[]).join(" · ")
                                            : "";
                                          navigator.clipboard.writeText(content);
                                          toast.success("Content copied to clipboard");
                                        }}
                                      >
                                        {run.inputValues
                                          ? (Object.values(run.inputValues) as string[]).join(" · ")
                                          : ""}
                                      </p>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[300px] break-words">
                                      {run.inputValues ? (Object.values(run.inputValues) as string[]).join(" · ") : ""}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-6">
                      <h2 className="text-3xl font-semibold text-gray-900">Generated Results</h2>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {runList.map((run) => (
                          <div
                            key={run.id}
                            className="group relative flex flex-col overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300"
                          >
                            <div className="flex-1 p-6">
                              <div className="group relative">
                                <div className="h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                  <Markdown
                                    className="prose prose-sm max-w-none 
                                      prose-headings:font-semibold prose-headings:text-gray-900 
                                      prose-p:text-gray-600 prose-strong:text-gray-900 
                                      prose-code:text-gray-900"
                                    content={run?.metadata.markdownOutput}
                                  />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-white/60 to-white opacity-0 transition-all duration-200 group-hover:opacity-100">
                                  <Button
                                    variant="default"
                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 
                                      hover:scale-105 hover:shadow-xl"
                                    onClick={() => {
                                      setRunDrawerOpen(true);
                                      setMarkdownGen(run?.metadata.markdownOutput);
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <p
                                      className="line-clamp-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900"
                                      onClick={() => {
                                        const content = run.inputValues
                                          ? (Object.values(run.inputValues) as string[]).join(" · ")
                                          : "";
                                        navigator.clipboard.writeText(content);
                                        toast.success("Content copied to clipboard");
                                      }}
                                    >
                                      {run.inputValues ? (Object.values(run.inputValues) as string[]).join(" · ") : ""}
                                    </p>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-[300px] break-words">
                                    {run.inputValues ? (Object.values(run.inputValues) as string[]).join(" · ") : ""}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
