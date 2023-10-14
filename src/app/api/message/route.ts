import { NextRequest } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { MessageSchema } from "@/lib/validations/message";
import { db } from "@/db";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { openai } from "@/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

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

  // Initialize OpenAI embeddings generator.
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // Initialize Pinecone client
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: "gcp-starter",
  });
  const pineconeIndex = pinecone.Index("insight");

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

  // Perform similarity search.
  const results = await vectorStore.similaritySearch(message, 4);

  // Retrieve 7 previous file messages.
  const prevMessages = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 7,
  });

  const formattedPrevMessages = prevMessages.map((message) => ({
    role: message.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: message.text,
  }));

  // Getting a response from the OpenAI GPT model
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0, // Controls randomness in the model's output. A value of 0 makes the output deterministic.
    stream: true, // Indicates that the completions should be streamed as they are generated.
    // An array of message objects representing a conversation history for the model to consider when generating a response.
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
    if (message.role === "user") return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${message}`, // The user's message is included in the conversation history.
      },
    ],
  });

  // Initialize response stream
  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      // When the stream ends, the answer message will be added to the database.
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          fileId: fileId,
          userId: userId,
        },
      });
    },
  });

  // Return streaming text response
  return new StreamingTextResponse(stream);
};
