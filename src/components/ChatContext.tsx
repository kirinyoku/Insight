import { createContext, useRef, useState } from "react";
import { useToast } from "./ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { useIntersection } from "@mantine/hooks";

interface StreamResponse {
  message: string;
  isLoading: boolean;
  addMessage: () => void;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ChatContext = createContext<StreamResponse>({
  message: "",
  isLoading: false,
  addMessage: () => {},
  handleInputChange: () => {},
});

interface ProviderProps {
  fileId: string;
  children: React.ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: ProviderProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const utils = trpc.useContext();
  const backupMessage = useRef("");

  const { toast } = useToast();
  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.body;
    },
    onMutate: async ({ message }) => {
      // Backup the current message, clear it, and cancel the existing query.
      backupMessage.current = message;
      setMessage("");
      await utils.getFileMessages.cancel();

      // Get the previous messages.
      const prevMessage = utils.getFileMessages.getInfiniteData();

      // Update the file messages data with the new message.
      utils.getFileMessages.setInfiniteData(
        {
          fileId,
          limit: INFINITE_QUERY_LIMIT,
        },
        (oldData) => {
          // If there's no existing data, create an initial structure.
          if (!oldData) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          // Prepare the new message and update the existing data.
          let newPages = [...oldData.pages];
          let latestPage = newPages[0];

          // Add the new user message to the beginning of the latest page's messages.
          latestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...latestPage.messages,
          ];

          // Update the latest page in the data structure.
          newPages[0] = latestPage;

          // Update the entire data structure with the updated pages.
          return {
            ...oldData,
            pages: newPages,
          };
        }
      );

      setIsLoading(true);

      return {
        // Return the previous messages as part of the mutation result.
        prevMessage: prevMessage?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: async (stream) => {
      // Handle success by updating data and displaying any received messages.
      setIsLoading(false);
      if (!stream)
        return toast({
          title: "The was a problem sending this message",
          description: "Please refresh this page and try again.",
          variant: "destructive",
        });

      // Read and process the stream of messages from the server.
      const reader = stream.getReader(); // Create a reader to read the stream.
      const decoder = new TextDecoder(); // Create a text decoder to convert binary data to text.
      let done = false; // Initialize a flag to track if reading is complete.
      let accumulatedResponse = ""; // Initialize a variable to accumulate message chunks.

      while (!done) {
        // Read the next chunk of data from the stream.
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value); // Decode the binary data to text.
        accumulatedResponse += chunkValue; // Accumulate the response chunk.

        // Update the existing data with the AI response.
        utils.getFileMessages.setInfiniteData(
          { fileId, limit: INFINITE_QUERY_LIMIT },
          (oldData) => {
            // If there's no existing data, create an initial structure.
            if (!oldData) return { pages: [], pageParams: [] };

            // Check if an AI response message already exists in the data.
            let isAIResponseCreated = oldData.pages.some((page) =>
              page.messages.some((message) => message.id === "ai-response")
            );

            // Create an updated set of pages with the new AI response message.
            let updatedPages = oldData.pages.map((page) => {
              if (page === oldData.pages[0]) {
                let updatedMessages;

                // If the AI response message doesn't exist, create it.
                if (!isAIResponseCreated) {
                  updatedMessages = [
                    {
                      createdAt: new Date().toISOString(),
                      id: "ai-response",
                      text: accumulatedResponse,
                      isUserMessage: false,
                    },
                    ...page.messages,
                  ];
                } else {
                  // If the AI response message already exists, update its text.
                  updatedMessages = page.messages.map((message) => {
                    if (message.id === "ai-response") {
                      return {
                        ...message,
                        text: accumulatedResponse,
                      };
                    }
                    return message;
                  });
                }
                // Update the page with the updated messages.
                return {
                  ...page,
                  messages: updatedMessages,
                };
              }
              return page;
            });
            // Update the entire data structure with the updated pages.
            return { ...oldData, pages: updatedPages };
          }
        );
      }
    },
    onError: (_, __, context) => {
      // Handle error by restoring the backup message and updating data.
      setMessage(backupMessage.current);
      utils.getFileMessages.setData(
        { fileId },
        { messages: context?.prevMessage ?? [] }
      );
    },
    onSettled: async () => {
      // Handle the end of the mutation by resetting loading state and invalidating the query.
      setIsLoading(false);
      await utils.getFileMessages.invalidate({ fileId });
    },
  });

  function addMessage() {
    sendMessage({ message });
  }

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(event.target.value);
  }

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
