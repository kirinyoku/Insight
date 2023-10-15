import { useContext, useRef, useTransition } from "react";
import { Button } from "./ui/button";
import { Icons } from "./ui/icons";
import { Textarea } from "./ui/textarea";
import { ChatContext } from "./ChatContext";
import { useTranslations } from "next-intl";

interface ChatInputProps {
  isDisabled?: boolean;
}

export default function ChatInput({ isDisabled }: ChatInputProps) {
  const i18n = useTranslations("chat");

  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 lg:mx-auto lg:max-w-2xl xl:max-w-4xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4 ">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                placeholder={i18n("placeholder")}
                rows={1}
                maxRows={4}
                autoFocus
                onChange={handleInputChange}
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addMessage();
                    textareaRef.current?.focus();
                    textareaRef.current?.value
                      ? (textareaRef.current.value = "")
                      : null;
                  }
                }}
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-primary scrollbar-thumb-rounded scrollbar-track-primary-lighter scrollbar-w-2 scrolling-touch"
              />
              <Button
                disabled={isLoading || isDisabled}
                className="absolute bottom-1.5 right-[8px]"
                aria-label="send message"
                size="sm"
                onClick={() => {
                  addMessage();
                  textareaRef.current?.focus();
                }}
              >
                <Icons.send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
