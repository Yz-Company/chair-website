import { Image } from "lucide-react";

import { useFileUpload, type FileWithPreview } from "../hooks/use-file-upload";
import { Button } from "./ui/button";

interface ImageUploadProps {
  callback: (file: FileWithPreview[]) => void;
  imageUrl?: string;
}

export default function ImageUpload({ callback, imageUrl }: ImageUploadProps) {
  const [{ files }, { openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
  });

  const previewUrl = files[0]?.preview || imageUrl || null;
  const fileName = files[0]?.file.name || null;

  return (
    <div className="flex flex-col gap-2">
      <div className="inline-flex items-center gap-2 align-top">
        <div
          className="border-input relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border"
          aria-label={
            previewUrl ? "Preview of uploaded image" : "Default user avatar"
          }
        >
          {previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt="Preview of uploaded image"
              width={32}
              height={32}
            />
          ) : (
            <div aria-hidden="true">
              <Image className="opacity-60" size={16} />
            </div>
          )}
        </div>
        <div className="relative inline-block">
          <Button
            variant="secondary"
            onClick={openFileDialog}
            aria-haspopup="dialog"
          >
            {fileName ? "Mudar imagem" : "Anexar comprovante"}
          </Button>
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload image file"
            tabIndex={-1}
          />
        </div>
      </div>
      {fileName && (
        <div className="inline-flex gap-2 text-xs">
          <p className="text-muted-foreground truncate" aria-live="polite">
            {fileName}
          </p>{" "}
          <button
            onClick={() => callback(files)}
            className="text-green-500 font-medium hover:underline cursor-pointer"
            aria-label={`Remove ${fileName}`}
          >
            Adicionar
          </button>
        </div>
      )}
    </div>
  );
}
