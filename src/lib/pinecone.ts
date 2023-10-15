import { Pinecone } from "@pinecone-database/pinecone";

// Initialize Pinecone client
export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: "gcp-starter",
});

// Using a single index name for all data
export const pineconeIndex = pinecone.Index("insight");
