"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useStores from "@/hooks/useStores";
import { observer } from "mobx-react";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { DocumentVisibility } from "@prisma/client";
import { ChevronRight, Code, ExternalLink, Globe, Lock, Play, Rocket, Sparkles, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

import { cn } from "@/lib/utils";
import { ssePost } from "@/service/base";
import Link from "next/link";
import Markdown from "react-markdown";
import { toast } from "sonner";

const BreadcrumbComponent = observer(() => {
  const { documents } = useStores();
  const { id } = useParams();
  const document = documents.get(id as string);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="text-foreground text-base font-semibold">{document?.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
});

const ShareButton = observer(() => {
  const [visibility, setVisibility] = useState("public");
  const { documents } = useStores();
  const { id } = useParams();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Rocket className="mr-2 h-4 w-4" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-[400px]">
        <div className="flex flex-col gap-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Deploy App</h3>
          <p className="text-sm text-muted-foreground">
            This will create an app page you can share as well as an API endpoint
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {visibility === "public" ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    {visibility === "public" ? "Public" : "Private"}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Public
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Private
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Public apps can be accessed by anyone, and might be featured in the explore page.
            </p>
          </div>
        </div>
        <div className="items-center p-6 pt-0 flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              const document = documents.get(id as string);

              await documents.update({
                id: id as string,
                version: 1.0,
                visibility: visibility as DocumentVisibility,
                publishedContent: document?.content,
                documentVersion: "1.0",
              });
              toast.success("Deployed successfully");
            }}
          >
            Deploy
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
});

const RunButton = () => {
  const { workbench, setting, dialogs } = useStores();
  return (
    <Button
      className="bg-cyan-400 text-green-foreground hover:bg-cyan-700"
      onClick={() => {
        dialogs.showInputsModal();
      }}
    >
      <Play className="mr-2 h-4 w-4" />
      Run
    </Button>
  );
};

const UpdateButton = () => {
  const { documents } = useStores();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const document = documents.get(id as string);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="aspect-square w-fit px-2 flex items-center justify-center">
          <UploadCloud className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-[400px]">
        <div className="flex flex-col gap-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Update App</h3>
          <p className="text-sm text-muted-foreground">This will update your app and create a new version</p>
        </div>
        <div className="p-6 pt-0">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 className="py-2 text-lg font-semibold">Your current deployment</h2>
              <div className="space-y-2">
                <Link target="_blank" href={`/app/explore/app/${document?.id}`}>
                  <div className="h-[36px] items-center rounded cursor-pointer justify-between flex w-full border-border border bg-[#FAFAFA] dark:bg-muted px-2.5 gap-8 mb-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <ExternalLink className="h-4 w-4" />
                      App page
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
                <Link href={`/app/${id}/deployments/${document?.id}/overview`}>
                  <div className="h-[36px] items-center rounded cursor-pointer justify-between flex w-full border-border border bg-[#FAFAFA] dark:bg-muted px-2.5 gap-8 mb-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Rocket className="h-4 w-4" />
                      Deployment page
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>

                <Link href={`/app/${id}/deployments/${document?.id}/api`}>
                  <div className="h-[36px] items-center rounded cursor-pointer justify-between flex w-full border-border border bg-[#FAFAFA] dark:bg-muted px-2.5 mb-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Code className="h-4 w-4" />
                      API docs
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
              </div>
              {/* <div className="h-[36px] items-center rounded cursor-pointer justify-between flex w-full border-border border bg-[#FAFAFA] dark:bg-muted px-2.5 gap-8">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileInput className="h-4 w-4" />
                  Prefilled Inputs
                </div>
                <ChevronRight className="h-4 w-4" />
              </div> */}
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="py-2 text-lg font-semibold">Current app</h2>
              <div className="flex items-center gap-1">
                <div className="inline-flex items-center rounded-full border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 py-0">
                  {document?.documentVersion}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>
                  You have made <span className="text-green-400">small, non-disruptive</span> changes. These updates
                  will take effect in your current API integrations right after you deploy.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="items-center p-6 pt-0 flex justify-between">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const document = documents.get(id as string);
              const version = (Number.parseFloat(document?.documentVersion || "1.0") + 0.1).toFixed(1).toString();

              documents.update({
                id: id as string,
                documentVersion: version,
                publishedContent: document?.content,
              });
              setOpen(false);
            }}
          >
            Update
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const AIButton = () => {
  const [open, setOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [promptText, setPromptText] = useState<string>("");
  const [markdownGen, setMarkdownGen] = useState<string>("");
  const [showMarkdownGen, setShowMarkdownGen] = useState<boolean>(false);
  const contentRef = useRef<string>(""); // 使用 ref 来跟踪内容

  // Add a new ref for the markdown container
  const markdownContainerRef = useRef<HTMLDivElement>(null);

  // Add useEffect to scroll to bottom when markdownGen updates
  useEffect(() => {
    if (markdownContainerRef.current) {
      markdownContainerRef.current.scrollTop = markdownContainerRef.current.scrollHeight;
    }
  }, [markdownGen]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setUploadedImage(file);
      setImagePreview(URL.createObjectURL(file));
    },
  });

  const clearImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-500 hover:bg-purple-600 text-white border-purple-500">
          <Sparkles className="mr-2 h-4 w-4" />
          AI GEN
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI Assistant</DialogTitle>
          <p className="text-sm text-muted-foreground">Get AI help with your current workflow</p>
        </DialogHeader>
        {showMarkdownGen ? (
          <div ref={markdownContainerRef} className="my-4 h-[400px] overflow-y-auto">
            <Markdown>{markdownGen}</Markdown>
          </div>
        ) : (
          <div className="my-4">
            <Label>Your IMAGE</Label>
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
                isDragActive
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-muted hover:bg-secondary/50",
              )}
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <div className="relative h-40 w-full group">
                  <Image src={imagePreview} alt="Uploaded preview" fill className="object-contain" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                    className="absolute top-0 right-0 p-1 rounded-full bg-background/80 hover:bg-background shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {isDragActive ? "Drop the image here..." : "Drag & drop an image here, or click to select"}
                </p>
              )}
            </div>
            <Label htmlFor="message">Your IDEA</Label>
            <Textarea
              id="message"
              placeholder="Enter your prompt here..."
              className="min-h-[100px] resize-none my-2"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />

            <DialogFooter>
              <Button
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                onClick={() => {
                  // setOpen(false);
                  setShowMarkdownGen(true);
                  ssePost(
                    "/api/prompt/generator",
                    {
                      body: {
                        prompt: promptText,
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
                        const docSize = window.editor?.state.doc.content.size;
                        // 使用 ref 的当前值，保证是最新的
                        // @ts-ignore
                        window.editor?.commands.insertContentAt(docSize, contentRef.current);
                        setOpen(false);
                      },
                      onWorkflowStarted: () => {
                        setMarkdownGen("");
                      },
                    },
                  );
                }}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const PageBar = () => {
  const { documents } = useStores();
  const { id } = useParams();
  const document = documents.get(id as string);

  const visibility = document?.visibility;

  return (
    <div className="flex h-[60px] items-center justify-between border-b bg-background px-1 md:px-5 flex-shrink-0">
      <div className="flex items-center gap-4 md:gap-2">
        <BreadcrumbComponent />
      </div>
      <div className="flex items-center gap-2">
        {visibility === null ? <ShareButton /> : <UpdateButton />}
        <AIButton />
        <RunButton />
      </div>
    </div>
  );
};

export default observer(PageBar);
