import React from "react";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import { Label } from "@shared/components/ui/label";
import { Input } from "@shared/components/ui/input";
import { cn } from "@shared/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@shared/components/ui/dialog";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@shared/components/ui/tooltip";

interface FileUploadFieldProps {
  label: string;
  register: UseFormRegisterReturn;
  required?: boolean;
  accept?: string;
  error?: FieldError | null;
  disabled?: boolean;
  existingUrl?: string;
  selectedFile?: any;
}

export const FileUploadField = ({
  label,
  register,
  required,
  disabled = false,
  accept = ".jpg,.jpeg,.png,.gif,.bmp,.webp,.pdf",
  error,
  existingUrl,
  selectedFile,
}: FileUploadFieldProps) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
  const fullUrl = existingUrl
    ? existingUrl.startsWith("http")
      ? existingUrl
      : `${BASE_URL}${existingUrl}`
    : null;



  // Determine effective file and preview URL
  let file: File | null = null;
  if (selectedFile) {
    if (selectedFile instanceof FileList && selectedFile.length > 0) {
      file = selectedFile[0];
    } else if (selectedFile instanceof File) {
      file = selectedFile;
    }
  }

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const displayUrl = previewUrl || fullUrl;

  console.log("displayUrl", displayUrl)

  const isImage = (url: string, fileObj?: File | null) => {
    if (fileObj) {
      return fileObj.type.startsWith("image/");
    }
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              >
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-gray-300 text-black max-w-[200px] text-center">
              Upload {label} ({accept.toLocaleUpperCase().replace(/\./g, "")})
              (max 2MB)
            </TooltipContent>
          </Tooltip>
        </div>

        {displayUrl && (
          <>
            {isImage(displayUrl, file) ? (
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Preview
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl bg-white p-2 overflow-hidden border-none shadow-2xl">
                  <DialogHeader className="sr-only">
                    <DialogTitle>Preview</DialogTitle>
                  </DialogHeader>
                  <div className="relative w-full aspect-auto max-h-[80vh] flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img
                      src={displayUrl}
                      alt="Profile Preview"
                      className="max-w-full max-h-full object-contain shadow-sm"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Link
                to={displayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                Preview
              </Link>
            )}
          </>
        )}
      </div>

      <Input
        type="file"
        accept={accept}
        disabled={disabled}
        {...register}
        className={cn(
          "h-9 border border-gray-300 rounded-md px-2 py-1 file:border-0 file:rounded-sm file:bg-blue-100 file:mr-3 file:px-4 file:py-1 file:cursor-pointer"
        )}
      />

      {error?.message && (
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
};
