import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
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

export default function InputUploadImage({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const dropzoneConfig = {
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        try {
          const url = await onUpload(acceptedFiles[0]);
          setImageUrl(url as string);
          setImageUrl(url as string);
          onChange(url as string);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    },
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneConfig);

  return (
    <div className="flex flex-col items-center justify-center h-56 md:h-72 space-y-6 relative mb-6 w-full">
      <div
        {...getRootProps({
          onClick: (e) => getRootProps().onClick(e),
        })}
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
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : isDragActive ? (
          <p className="text-lg md:text-xl text-black mb-4">Drop your image here...</p>
        ) : (
          <>
            <p className="text-lg md:text-xl text-black mb-4">Drag & drop images of websites</p>
            <p className="text-base md:text-lg text-black/70 mb-4">or</p>
            <Button variant="default" size="lg" className="mt-2 text-lg">
              Choose files
            </Button>
            <p className="text-sm text-black/50 mt-4">Note: Only one image can be uploaded at a time.</p>
          </>
        )}
      </div>
    </div>
  );
}
