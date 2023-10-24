import OpenAI from "openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize OpenAI embeddings generator.
export const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});
