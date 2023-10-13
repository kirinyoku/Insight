import { z } from "zod";

export const MessageSchema = z.object({
  fileId: z.string(),
  message: z.string(),
});
