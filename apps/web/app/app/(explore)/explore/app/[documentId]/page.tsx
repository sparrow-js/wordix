"use client";

import { Button } from "@/components/ui/button";
import { Copy, Sparkles, X } from "lucide-react";
import { useParams } from "next/navigation";
import { type DropEvent, type FileRejection, useDropzone } from "react-dropzone";

import DescriptionEditor from "@/components/description-editor";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ssePost } from "@/service/base";
import { client } from "@/utils/ApiClient";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
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
    if (res.data) {
      const content = res.data.content;
      setDocumentDoc(content);
      setCollectionId(res.data.collectionId);
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
    }
  };

  const generatePrompt = async () => {
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
          // @ts-ignore
          // const docSize = window.editor?.state.doc.content.size;
          // 使用 ref 的当前值，保证是最新的
          // @ts-ignore
          // window.editor?.commands.insertContentAt(docSize, contentRef.current);
        },
        onWorkflowStarted: () => {
          setMarkdownGen("");
        },
      },
    );
  };

  useEffect(() => {
    fetchDocument();
  }, [documentId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [markdownGen]);

  return (
    <main
      className="flex-grow w-full min-h-screen bg-background"
      style={{
        backgroundImage: "url('/coolHue-81FBB8-28C76F.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row space-y-12 md:space-y-0 md:space-x-12 relative pt-24">
          <div className="w-full md:w-1/2 flex flex-col items-start justify-center md:-mt-12 px-6">
            <div className="text-left mb-8">
              <p className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight md:leading-snug lg:leading-normal">
                {title}
              </p>
              {descriptionDoc && <DescriptionEditor initialContent={descriptionDoc} />}
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-12 relative">
            <div className="max-w-md mx-auto relative">
              <div className="text-card-foreground shadow-sm border-0 relative bg-opacity-80 backdrop-blur-md rounded-lg p-8 text-center transition-colors">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-100 to-gray-300 -z-10" />
                <div className="absolute inset-[1px] rounded-lg bg-gradient-to-r from-gray-100 to-gray-300 bg-opacity-80 backdrop-blur-md -z-10" />
                <div className="relative z-0">
                  {inputList.map((input) => {
                    if (input.type === "image") {
                      return (
                        <div
                          key={input.id}
                          className="flex flex-col items-center justify-center h-56 md:h-72 space-y-6 relative mb-6"
                        >
                          <div
                            {...getRootProps({
                              onClick: (e) => getRootProps().onClick(e),
                            })}
                            id={input.id}
                            className="bg-gray-300 p-6 rounded-lg w-full h-full flex flex-col items-center justify-center border border-gray-400/50 cursor-pointer hover:border-gray-400 transition-colors relative"
                          >
                            <input {...getInputProps()} />
                            {imageUrl ? (
                              <div className="relative w-full h-full">
                                <img src={imageUrl} alt="Uploaded preview" className="w-full h-full object-contain" />
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setImageUrl("");
                                    setInputValues((prev) => ({ ...prev, [input.id]: "" }));
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : isDragActive ? (
                              <p className="text-lg md:text-xl text-black mb-4">Drop your image here...</p>
                            ) : (
                              <>
                                <p className="text-lg md:text-xl text-black mb-4">
                                  Drag & drop images of websites, Figma designs, or UI mockups here
                                </p>
                                <p className="text-base md:text-lg text-black/70 mb-4">or</p>
                                <Button variant="default" size="lg" className="mt-2 text-lg">
                                  Choose files
                                </Button>
                                <p className="text-sm text-black/50 mt-4">
                                  Note: Only one image can be uploaded at a time.
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    }

                    if (input.type === "text") {
                      return (
                        <div key={input.id} className="mb-6 flex flex-col gap-2 justify-start items-start">
                          <Label>{input.label}</Label>
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
                          <Label>{input.label}</Label>
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
                  <Drawer>
                    <DrawerTrigger asChild>
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
                    </DrawerTrigger>
                    <DrawerContent className="h-[82vh] py-8">
                      <div ref={scrollRef} className="mx-auto w-full px-24 relative h-full overflow-y-auto">
                        <div className="p-4 select-text">
                          <Markdown>{markdownGen}</Markdown>
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
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
