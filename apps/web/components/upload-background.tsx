"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { coolhue } from "./coolhue";

interface UploadBackgroundProps {
  onUpload?: (url: string) => void;
  className?: string;
  defaultImage?: string;
}

export default function UploadBackground({ onUpload, className, defaultImage }: UploadBackgroundProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
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
            setImageUrl(url);
            const image = new Image();
            image.src = url;
            image.onload = () => {
              onUpload?.(url);
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
          await handleUpload(acceptedFiles[0]);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    },
  });

  return (
    <div className="relative">
      <div
        {...getRootProps()}
        className={cn(
          "group relative cursor-pointer rounded-2xl transition-all duration-200",
          isDragActive && "bg-primary/5 ring-2 ring-primary/10",
        )}
      >
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-4 rounded-2xl border-[1px] border-dashed",
            "p-12 text-base",
            "hover:border-primary/40",
            isDragActive && "border-primary bg-primary/5",
            !defaultImage && "h-[280px]",
            "relative z-10",
            className,
          )}
        >
          <input {...getInputProps()} />
          <svg
            className={cn(
              "h-10 w-10 text-muted-foreground/50 transition-colors duration-200",
              isDragActive && "text-primary",
              "group-hover:text-primary",
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          {isDragActive ? (
            <p className="font-medium text-primary">Drop the image here...</p>
          ) : (
            <p className="text-center text-muted-foreground/60 text-lg">
              {defaultImage ? "Click or drag to change image" : <>Click or drag to change image</>}
            </p>
          )}
        </div>
        {(imageUrl || defaultImage) && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <img src={imageUrl || defaultImage} alt="Uploaded background" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
          </div>
        )}
      </div>
      <div>
        <div className="grid grid-cols-6 gap-2 mt-4">
          {coolhue.map((colors, index) => (
            <div
              key={index}
              className="h-8 w-full rounded-md cursor-pointer ring-offset-2 hover:ring-2 hover:ring-primary/50 transition-all"
              style={{
                background: `url("/coolHue/coolHue-${colors[0].replace("#", "")}-${colors[1].replace("#", "")}.png")`,
                backgroundSize: "cover",
              }}
              onClick={() => {
                // Handle gradient selection
                onUpload?.(`/coolHue/coolHue-${colors[0].replace("#", "")}-${colors[1].replace("#", "")}.png`);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  // Handle gradient selection
                }
              }}
              role="button"
              tabIndex={0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
