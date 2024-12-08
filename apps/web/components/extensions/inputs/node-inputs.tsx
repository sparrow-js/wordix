import { Button } from "@/components/ui/button";
import { NodeViewContent, type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useEffect } from "react";
import { useDropzone } from "react-dropzone";

import useStores from "@/hooks/useStores";
import { observer } from "mobx-react";
import { v4 as uuidv4 } from "uuid";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Play, Plus } from "lucide-react";
import { toast } from "sonner";

export const InputView = observer((props: NodeViewProps) => {
  const { workbench, dialogs, inputsNode, setting, execute } = useStores();

  useEffect(() => {
    // When the selected state changes, perform the corresponding logic
    if (props.selected) {
      console.log("Node selected");
    } else {
      console.log("Node unselected");
      workbench.setHideSidebar();
    }
  }, [props.selected]);

  return (
    <NodeViewWrapper>
      <div className="select-none rounded-lg bg-stone-100 p-3">
        <div
          onClick={() => {
            dialogs.showInputsModal();
          }}
          className="flex h-full flex-auto items-center justify-between text-stone-400 hover:text-stone-500"
        >
          <div className="ml-1 mr-5">
            <span className="cursor-pointer select-none text-xs font-semibold uppercase tracking-tight">Inputs</span>
          </div>
          <div className="grid grow grid-cols-1">
            <div className="w-full" style={{ whiteSpace: "pre-wrap" }}>
              <NodeViewContent contenteditable="false" as="div" />
            </div>
          </div>
          <div
            className="cursor-pointer rounded-lg p-2 align-middle transition-colors duration-200 hover:bg-stone-200"
            onClick={(e) => {
              console.log("clicked");
              e.stopPropagation();
              const id = uuidv4();

              props.editor
                .chain()
                .setInput({
                  id,
                  label: "input new",
                  description: "",
                  type: "text",
                })
                .focus()
                .run();
              inputsNode.setSelectedId(id);
              workbench.setShowSidebar();
            }}
          >
            <div className="flex flex-1 items-center align-middle">
              <Plus className="mr-2 h-4 w-4" />
              <span className="cursor-pointer select-none text-sm font-semibold uppercase tracking-tight">Add</span>
            </div>
          </div>
        </div>
        <Dialog
          open={dialogs.openInputsModal}
          onOpenChange={(status: boolean) => {
            dialogs.toggleInputsModal(status);
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="flex w-full">
              <div className="mt-4 w-full">
                <form
                  className="space-y-6"
                  action={async (data: FormData) => {
                    const inputs = {};
                    for (const key of data.keys()) {
                      inputs[key] = data.get(key);
                    }
                    dialogs.hideInputsModal();
                    execute.setStatus("start");
                    setting.setSettingComponentName("executeResult", inputs);
                    workbench.setShowSidebar();
                  }}
                >
                  {inputsNode.list.map((input) => {
                    if (input.type === "text") {
                      return (
                        <div className="space-y-2 w-full">
                          <Label>{input.label}</Label>
                          <Input
                            value={input.value}
                            name={input.id}
                            onChange={(e) => {
                              input.value = e.target.value;
                            }}
                          />
                          {input.description && <p className="text-sm text-muted-foreground">{input.description}</p>}
                        </div>
                      );
                    }

                    if (input.type === "image") {
                      return (
                        <div className="space-y-2 w-full" key={input.id}>
                          <Label>{input.label}</Label>
                          <input type="hidden" name={input.id} value={input.value || ""} />
                          <ImageUpload
                            value={input.value}
                            onChange={(file) => {
                              console.log("image changed", file);
                              input.value = file;
                            }}
                            name={input.id}
                          />
                          {input.description && <p className="text-sm text-muted-foreground">{input.description}</p>}
                        </div>
                      );
                    }

                    if (input.type === "longText") {
                      return (
                        <div className="space-y-2 w-full">
                          <Label>{input.label}</Label>
                          <Textarea
                            value={input.value}
                            name={input.id}
                            onChange={(e) => {
                              input.value = e.target.value;
                            }}
                          />
                        </div>
                      );
                    }

                    return null;
                  })}
                  <div className="bottom-5 right-5 z-50 flex justify-end">
                    <div className="relative overflow-hidden bg-cover bg-center p-2">
                      <Button>
                        <Play />
                        Run
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </NodeViewWrapper>
  );
});

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

const ImageUpload = ({ value, onChange, name }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        try {
          const url = await onUpload(acceptedFiles[0]);
          console.log("image url", url);
          onChange(url);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
        ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"}`}
    >
      <input {...getInputProps()} name={name} />
      {value ? (
        <div className="space-y-2">
          <img
            src={value instanceof File ? URL.createObjectURL(value) : value}
            alt="Preview"
            className="max-h-40 mx-auto"
          />
          <p className="text-sm text-muted-foreground">{value instanceof File ? value.name : "Uploaded image"}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p>Drag and drop an image here, or click to upload</p>
          <p className="text-sm text-muted-foreground">Supports JPG, PNG, GIF</p>
        </div>
      )}
    </div>
  );
};
