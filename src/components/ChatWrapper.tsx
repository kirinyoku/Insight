"use client";

import Link from "next/link";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { cn } from "@/lib/utils";
import { Icons } from "./ui/icons";
import { buttonVariants } from "./ui/button";
import { trpc } from "@/app/_trpc/client";
import { ChatContextProvider } from "./ChatContext";
import { useTranslations } from "next-intl";

interface ChatWrapperProps {
  fileId: string;
}

export default function ChatWrapper({ fileId }: ChatWrapperProps) {
  const i18n = useTranslations("chat");

  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { fileId },
    {
      refetchInterval: (data) => {
        return data?.status === "SUCCESS" || data?.status === "FAILED"
          ? false
          : 500;
      },
    }
  );

  if (isLoading)
    return (
      <div className="relative min-h-full bg-background flex divide-border flex-col justify-between gap-2">
        <div className="flex-1 flex flex-col justify-center items-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <Icons.spinner className="h-8 w-8 text-primary/80 animate-spin" />
            <h3 className="font-semibold text-xl">{i18n("loading.title")}</h3>
            <p className="text-foreground/70 text-sm">
              {i18n("loading.description")}
            </p>
          </div>
        </div>

        <ChatInput isDisabled={true} />
      </div>
    );

  if (data?.status === "PROCESSING")
    return (
      <div className="relative min-h-full bg-background flex divide-border flex-col justify-between gap-2">
        <div className="flex-1 flex flex-col justify-center items-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <Icons.spinner className="h-8 w-8 text-primary/80 animate-spin" />
            <h3 className="font-semibold text-xl">
              {i18n("processing.title")}
            </h3>
            <p className="text-foreground/70 text-sm">
              {i18n("processing.description")}
            </p>
          </div>
        </div>

        <ChatInput isDisabled={true} />
      </div>
    );

  if (data?.status === "FAILED")
    return (
      <div className="relative min-h-full bg-background flex divide-border flex-col justify-between gap-2">
        <div className="flex-1 flex flex-col justify-center items-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <Icons.failed className="h-8 w-8 text-destructive" />
            <h3 className="font-semibold text-xl">{i18n("error.title")}</h3>
            <p className="text-foreground/70 text-sm">
              {i18n("loading.description")}
            </p>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" })
              )}
            >
              <Icons.chevronLeft className="h-4 w-4 mr-1" />{" "}
              {i18n("error.button")}
            </Link>
          </div>
        </div>

        <ChatInput isDisabled={true} />
      </div>
    );

  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative min-h-full bg-background flex divide-y divide-border flex-col justify-between gap-2">
        <div className="flex-1 justify-between flex flex-col mb-28">
          <Messages fileId={fileId} />
        </div>

        <ChatInput />
      </div>
    </ChatContextProvider>
  );
}
