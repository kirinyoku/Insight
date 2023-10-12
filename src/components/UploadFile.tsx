"use client";

import Dropzone from "react-dropzone";
import { useState } from "react";
import { Button } from "./ui/button";
import { Icons } from "./ui/icons";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "./ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function UploadFile() {
  const router = useRouter();
  const i18n = useTranslations("UploadFile");
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingError, setIsUploadingError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { startUpload } = useUploadThing("pdfUploader");
  const { mutate: polling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 1000,
  });

  // Simulated progress bar during file upload for a better user experience.
  function simulateProgress() {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95 || isUploadingError) {
          clearInterval(interval);
          return prev;
        }

        return prev + 5;
      });
    }, 500);

    return interval;
  }

  // Called when the user starts uploading a file.
  async function handleDrop(file: File[]) {
    setIsUploading(true);
    const progressInterval = simulateProgress();
    const res = await startUpload(file);

    if (!res) {
      setIsUploadingError(true);
      return toast({
        title: i18n("toast-error.title"),
        description: i18n("toast-error.description"),
        variant: "destructive",
      });
    }

    const [fileResponse] = res;
    const { key } = fileResponse;

    if (!key) {
      setIsUploadingError(true);
      return toast({
        title: i18n("toast-error.title"),
        description: i18n("toast-error.description"),
        variant: "destructive",
      });
    }

    clearInterval(progressInterval);
    setUploadProgress(100);

    polling({ key });
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(visible) => {
        if (!visible) {
          setIsOpen(visible);
        }
      }}
    >
      <DialogTrigger
        onClick={() => {
          setIsOpen(true);
          setUploadProgress(0);
          setIsUploadingError(false);
        }}
        asChild
      >
        <Button size="lg">{i18n("upload-file")}</Button>
      </DialogTrigger>
      <DialogContent>
        <Dropzone multiple={false} onDrop={handleDrop}>
          {({ getRootProps, getInputProps, acceptedFiles }) => (
            <div
              {...getRootProps()}
              className="border border-border border-dashed h-64 m-4 rounded-lg"
            >
              <div className="flex items-center justify-center h-full w-full">
                <label
                  htmlFor="dropzone-file"
                  className={`flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-accent/30 hover:bg-accent/70 ${
                    uploadProgress === 100
                      ? "bg-primary/20"
                      : isUploadingError
                      ? "bg-destructive/30"
                      : null
                  } transition-colors`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Icons.cloud className="h-6 w-6 text-foreground/60 mb-2" />
                    <p className="mb-2 text-sm text-foreground/80">
                      <span className="font-semibold">
                        {i18n("dropzone.instruction.1st")}
                      </span>{" "}
                      {i18n("dropzone.instruction.2nd")}
                    </p>
                    <p className="text-xs text-foreground/60">
                      PDF ({i18n("dropzone.limit")} 4MB)
                    </p>
                  </div>

                  {acceptedFiles && acceptedFiles[0] ? (
                    <div className="max-w-xs bg-background flex items-center rounded-md overflow-hidden outline outline-[1px] outline-accent divide-x divide-accent">
                      <div className="px-3 py-2 h-full grid place-items-center">
                        <Icons.page className="h-4 w-4 text-primary" />
                      </div>
                      <div className="px-3 py-2 h-full text-sm truncate">
                        {acceptedFiles[0].name}
                      </div>
                    </div>
                  ) : null}

                  {isUploading ? (
                    <div className="w-full mt-4 max-w-xs mx-auto">
                      {!isUploadingError ? (
                        <Progress
                          value={uploadProgress}
                          className="h-1 w-full bg-accent"
                        />
                      ) : null}
                      {uploadProgress === 100 ? (
                        <div className="flex gap-1 items-center justify-center text-sm text-foreground/80 text-center pt-2">
                          <Icons.spinner className="w-4 h-4 animate-spin" />{" "}
                          {i18n("dropzone.redirect")}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <input
                    type="file"
                    id="dropzone-file"
                    className="hidden"
                    {...getInputProps()}
                  />
                </label>
              </div>
            </div>
          )}
        </Dropzone>
      </DialogContent>
    </Dialog>
  );
}
