"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useStores from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import type Document from "@/models/Document";
import { Check, ChevronsUpDown, Globe, Lock } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const visibilityOptions = [
  {
    value: "public",
    label: "Public",
    icon: <Globe className="h-4 w-4" />,
    description: "Public apps can be accessed by anyone",
  },
  {
    value: "private",
    label: "Private",
    icon: <Lock className="h-4 w-4" />,
    description: "Private apps can only be accessed by you",
  },
];

export default function EditPage() {
  const { documentId, collectionId } = useParams<{ documentId: string; collectionId: string }>();
  const { documents } = useStores();
  const [document, setDocument] = useState<Document | null>(null);
  const [visibility, setVisibility] = useState<string>("public");
  const [value, setValue] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    async function fetchDocument() {
      const doc = await documents.fetchWithSharedTree(documentId);
      setDocument(doc.document);
    }
    fetchDocument();
  }, [documentId]);

  const onUpload = async (file: File) => {
    const promise = fetch("/api/upload", {
      method: "POST",
      headers: {
        "content-type": file?.type || "application/octet-stream",
        "x-vercel-filename": file?.name || "image.png",
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        try {
          const url = await onUpload(acceptedFiles[0]);
          document?.updateData({ bannerImage: url });
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    },
  });

  const handleSubmit = async () => {
    await document?.save({
      bannerImage: document?.bannerImage,
      visibility: document?.visibility,
    });
    router.push(`/${collectionId}/deployments/${documentId}`);
  };

  return (
    <div className="flex h-[calc(100svh-120px)] overflow-hidden">
      <div
        className="flex h-full w-full data-[panel-group-direction=vertical]:flex-col"
        style={{ display: "flex", flexDirection: "row", height: "100%", overflow: "hidden", width: "100%" }}
      >
        <div className="" style={{ flex: "1 1 0px", overflow: "hidden" }}>
          <div className="flex h-full overflow-y-auto">
            <div className="w-full px-1 py-4 md:p-5">
              <div className="flex w-full flex-wrap items-start gap-4">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex-1">
                  <div className="flex flex-col gap-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Edit Info</h3>
                    <p className="text-sm text-muted-foreground">Edit basic info about your app</p>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Visibility
                        </label>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" className="w-full justify-between">
                              <div className="flex items-center gap-2">
                                {document?.visibility ? (
                                  <>
                                    {visibilityOptions.find((option) => option.value === document.visibility)?.icon}
                                    {visibilityOptions.find((option) => option.value === document.visibility)?.label}
                                  </>
                                ) : (
                                  "Select"
                                )}
                              </div>
                              <ChevronsUpDown className="h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                            <Command>
                              <CommandList>
                                <CommandEmpty>No option found.</CommandEmpty>
                                <CommandGroup>
                                  {visibilityOptions.map((option) => (
                                    <CommandItem
                                      key={option.value}
                                      value={option.value}
                                      onSelect={(currentValue) => {
                                        setOpen(false);
                                        document?.updateData({ visibility: currentValue });
                                      }}
                                    >
                                      <div className="flex items-center gap-2">
                                        {option.icon}
                                        <div className="flex flex-col">
                                          <div>{option.label}</div>
                                          <div className="text-sm text-muted-foreground">{option.description}</div>
                                        </div>
                                      </div>
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          value === option.value ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <p className="text-sm text-muted-foreground">
                          Public apps can be accessed by anyone, and might be featured in the explore page.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Banner Image Preview
                        </label>
                        <div style={{ position: "relative", width: "100%", paddingBottom: "20%" }}>
                          <div
                            className="relative mt-2 overflow-hidden rounded-md bg-muted"
                            style={{ position: "absolute", inset: "0px" }}
                          >
                            <img
                              alt="App banner"
                              className="object-cover"
                              sizes="100vw"
                              src={document?.bannerImage || "/coolHue-81FBB8-28C76F.png"}
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                inset: "0px",
                                color: "transparent",
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* <Button variant="secondary" className="flex gap-2">
                            <Sparkles className="h-4 w-4" />
                            Generate
                          </Button> */}
                          <div className="w-32 text-sm text-gray-500">upload:</div>
                          <div
                            {...getRootProps()}
                            className={cn(
                              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                              "hover:bg-accent hover:text-accent-foreground",
                              "cursor-pointer transition-colors",
                              isDragActive && "border-primary",
                            )}
                          >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                              <p>Drop the image here...</p>
                            ) : (
                              <p>Drag & drop an image here, or click to select</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center p-6 pt-0">
                    <Button type="submit" onClick={handleSubmit}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90"
          style={{ cursor: "ew-resize", touchAction: "none", userSelect: "none" }}
        />
      </div>
    </div>
  );
}
