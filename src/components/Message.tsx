import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/message";
import { Icons } from "./ui/icons";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { forwardRef } from "react";

interface MessageProps {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}

export default forwardRef<HTMLDivElement, MessageProps>(function Message(
  { message, isNextMessageSamePerson },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn("flex items-end", {
        "justify-end": message.isUserMessage,
      })}
    >
      <div
        className={cn(
          "relative flex h-8 w-8 aspect-square items-center justify-center",

          {
            "bg-primary/80 order-2 rounded-sm": message.isUserMessage,
            "bg-foreground order-1 rounded-sm": !message.isUserMessage,
            invisible: isNextMessageSamePerson,
          }
        )}
      >
        {message.isUserMessage ? (
          <Icons.user className="fill-accent text-accent h-3/4 w-3/4" />
        ) : (
          <Icons.logo className="fill-ceent text-accent h-3/4 w-3/4" />
        )}
      </div>
      <div
        className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
          "order-1 items-end": message.isUserMessage,
          "order-2 items-start": !message.isUserMessage,
        })}
      >
        <div
          className={cn("px-4 py-2 rounded-lg inline-block text-foreground", {
            "bg-primary/40": message.isUserMessage,
            "bg-accent": !message.isUserMessage,
            "rounded-br-none":
              !isNextMessageSamePerson && message.isUserMessage,
            "rounded-bl-none":
              !isNextMessageSamePerson && !message.isUserMessage,
          })}
        >
          {typeof message.text === "string" ? (
            <ReactMarkdown className={cn("prose text-foreground")}>
              {message.text}
            </ReactMarkdown>
          ) : (
            message.text
          )}
          {message.id !== "loading-message" ? (
            <div
              className={cn(
                "text-xs select-none mt-2 w-full text-right text-foreground"
              )}
            >
              {format(new Date(message.createdAt), "HH:mm")}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}).displayName = "Message";
