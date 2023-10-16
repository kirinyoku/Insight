import { NextRequest } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { MessageSchema } from "@/lib/validations/message";
import { db } from "@/db";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { embeddings, openai } from "@/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { SearchResult, customFilter, pineconeIndex } from "@/lib/pinecone";

export const POST = async (req: NextRequest) => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  // Checking if the user is authorized.
  const { id: userId } = user;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  // Parsing request body
  const body = await req.json();
  const { fileId, message } = MessageSchema.parse(body);

  // Checking the existing of a file in the database.
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: userId,
    },
  });
  if (!file) return new Response("Not found", { status: 404 });

  // Adding a user message to the database.
  await db.message.create({
    data: {
      text: message,
      userId: userId,
      fileId: fileId,
      isUserMessage: true,
    },
  });

  // Getting a vectorized PDF file from Pinecone DB.
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    /* 
      There should be a namespace property with file.key data here, 
      but the "Starter" Pinecone plan does not support it.
      -----------------------------------------------------------
      namespace: file.key
    */
    pineconeIndex,
  });

  try {
    // Search for similar messages using the file ID as context
    const results = await vectorStore.similaritySearch(message, 1, {
      filter: (result: SearchResult) => customFilter(result, file.id),
    });

    // Retrieve 7 previous file messages.
    const prevMessages = await db.message.findMany({
      where: { fileId },
      orderBy: { createdAt: "asc" },
      take: 6,
    });
    const formattedPrevMessages = prevMessages.map((msg) => ({
      role: msg.isUserMessage ? "user" : "assistant",
      content: msg.text,
    }));

    // Construct a context string with previous conversation, results, and user input
    const context = `PREVIOUS CONVERSATION:${formattedPrevMessages.map(
      (msg) => {
        if (msg.role === "user") return `User:${msg.content}\n`;
        return `Assistant:${msg.content}\n`;
      }
    )}CONTEXT:${results
      .map((r) => r.pageContent)
      .join("\n\n")}USER INPUT:${message}`;

    // Use a system message to instruct the model
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.7, // Controls randomness in the model's output. A value of 0 makes the output deterministic.
      stream: true, // Indicates that the completions should be streamed as they are generated.
      // An array of message objects representing a conversation history for the model to consider when generating a response.
      messages: [
        {
          role: "system",
          content:
            "You have access to a PDF document. Please use the information from the document to answer the user's question.",
        },
        {
          role: "user",
          content: context, // Provide the context here
        },
      ],
    });

    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        // When the stream ends, the answer message will be added to the database.
        await db.message.create({
          data: {
            text: completion,
            isUserMessage: false,
            fileId,
            userId,
          },
        });
      },
    });

    // Return streaming text response
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error searching for similar messages:", error);
    return new Response("InternalServerError", { status: 500 });
  }
};
