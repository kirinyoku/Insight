"use client";

import ChatInput from "@/components/ChatInput";
import Message from "@/components/Message";
import { ExtendedMessage } from "@/types/message";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const i18n = useTranslations("not-found");

  const message1: ExtendedMessage = {
    id: "2",
    text: (
      <>
        <p>{i18n("message-1.question")}</p>
        <br />
        <p>
          {i18n("message-1.guidance")}{" "}
          <Link
            href="/"
            className="underline text-primary uppercase font-semibold"
          >
            {i18n("message-1.link")}
          </Link>
        </p>
      </>
    ),
    isUserMessage: false,
    createdAt: new Date().toISOString(),
  };

  const message2: ExtendedMessage = {
    id: "1",
    text: i18n("message-2"),
    isUserMessage: false,
    createdAt: new Date().toISOString(),
  };

  return (
    <main className="flex justify-center items-center w-full h-[calc(100vh-3.5rem)] md:py-2">
      <div className="relative min-h-full md:min-h-80 max-w-4xl w-full bg-background flex divide-y divide-border flex-col justify-between gap-2 rounded-md border border-border">
        <div className="flex-1 justify-between flex flex-col mb-28">
          <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-border flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-primary scrollbar-thumb-rounded scrollbar-track-lighter scrollbar-w-2 scrolling-touch">
            <Message message={message1} isNextMessageSamePerson={false} />
            <Message message={message2} isNextMessageSamePerson={true} />
          </div>
        </div>
        <ChatInput isDisabled={true} />
      </div>
    </main>
  );
}
