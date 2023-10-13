import { AppRouter } from "@/trpc";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type Messages = RouterOutput["getFileMessages"]["messages"];

export type OmitTextMessage = Omit<Messages[number], "text">;

export type ExtendedTextMessage = {
  text: string | JSX.Element;
};

export type ExtendedMessage = OmitTextMessage & ExtendedTextMessage;
