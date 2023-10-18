import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { pineconeIndex } from "@/lib/pinecone";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      const { getUser } = getKindeServerSession();
      const user = getUser();

      // The user will not be able to upload
      if (!user || !user?.id) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Checking if the file already exists in the database
      const isFileExist = await db.file.findFirst({
        where: {
          key: file.key,
        },
      });
      if (isFileExist) return;

      // Adding a PDF file to the database
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          // URL of the S3 bucket where the PDF file is stored
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          // "PROCESSING" means that the PDF has been added to the database but not yet vectorized.
          uploadStatus: "PROCESSING",
        },
      });

      // Vectorize a PDF file and save it to the Pinecone vector database.
      try {
        // Fetches a file from an S3 bucket
        const response = await fetch(
          `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
        );

        // Loads the fetched file as a PDF
        const blob = await response.blob();
        const loader = new PDFLoader(blob);
        const pageLevelDocs = await loader.load(); // Array containing individual pages of a document

        // Add a 'dataset' field to the data to distinguish the source
        const combinedData = pageLevelDocs.map((document) => {
          return {
            ...document,
            metadata: {
              fileId: createdFile.id,
            },
            dataset: "pdf", // Use a field to indicate the source dataset (e.g., 'pdf')
          };
        });

        // Initializes OpenAI embeddings with an API key
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        });

        // Stores the vectorized documents in Pinecone
        await PineconeStore.fromDocuments(combinedData, embeddings, {
          /* 
            There should be a namespace property with file.key data here, 
            but the "Starter" Pinecone plan does not support it.
            -----------------------------------------------------------
            namespace: file.key
          */
          pineconeIndex,
        });

        // Updates the upload status of the file in the database to "SUCCESS"
        await db.file.update({
          data: {
            uploadStatus: "SUCCESS",
          },
          where: {
            id: createdFile.id,
          },
        });
      } catch (error) {
        // Error handling.
        console.error(error);
        await db.file.update({
          data: {
            uploadStatus: "FAILED",
          },
          where: {
            id: createdFile.id,
          },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
