import clsx from "clsx"; // constructing className strings conditionally.
import type { ClassValue } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge"; // merge tailwind classes without style conflicts.

/* cn - ClassName. Utility function for merging 
tailwind classes without conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;

  if (process.env.SITE_URL) {
    return `https://${process.env.SITE_URL}${path}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title = "Insight - Unlock the Power of Your PDFs.",
  description = "Insight is a web service for natural language chat with your PDFs, making it faster and easier to find information, summarize, and explore related topics.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false,
}: MetadataProps = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@kirinyoku",
    },
    icons,
    metadataBase: new URL(absoluteUrl("")),
    themeColor: "#FFF",
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
