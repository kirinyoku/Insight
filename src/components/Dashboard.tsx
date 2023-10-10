"use client";

import Link from "next/link";
import UploadButton from "./UploadButton";
import { trpc } from "@/app/_trpc/client";
import { Icons } from "./ui/icons";
import { Skeleton } from "./ui/skeleton";
import { format } from "date-fns";
import { useLocale } from "next-intl";
import { enGB, uk } from "date-fns/locale";
import { Button } from "./ui/button";
import { useState } from "react";

export default function Dashboard() {
  const locale = useLocale();
  const trpcContext = trpc.useContext();
  const [currntlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  const { data: files, isLoading } = trpc.userFiles.useQuery();
  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      /* 
        if deletion was successful, force tRPC 
        to refetch user files (updating UI) 
      */
      trpcContext.userFiles.invalidate();
    },
    onMutate: ({ id }) => {
      setCurrentlyDeletingFile(id);
    },
    onSettled: () => {
      setCurrentlyDeletingFile(null);
    },
  });

  type Files = NonNullable<typeof files>;

  function sortFilesByDate(files: Files) {
    return files.sort((current, next) => {
      return (
        new Date(current.updatedAt).getTime() -
        new Date(next.updatedAt).getTime()
      );
    });
  }

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <header className="mt-4 flex flex-col items-start justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:gap-0">
        <h2 className="mb-2 font-bold text-5xl text-foreground/80">
          My Documents
        </h2>
        <UploadButton />
      </header>

      {files && files.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-border md:grid-cols-2 lg:grid-cols-3">
          {sortFilesByDate(files).map((file) => (
            <li
              key={file.id}
              className="col-span-1 divide-y divide-border border border-border rounded-lg bg-background shadow transition hover:shadow-lg hover:shadow-primary/20"
            >
              <Link
                href={`/dashboard/${file.id}`}
                className="flex flex-col gap-2"
              >
                <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-primary to-[#049458]" />
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-lg font-medium text-foreground/80">
                        {file.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-2 text-xs text-foreground/50">
                <div className="flex items-center gap-2">
                  <Icons.add className="w-4 h-4" />
                  {format(new Date(file.createdAt), "dd MMM yyyy", {
                    // setting the local date
                    locale: locale === "ua" ? uk : enGB,
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Icons.chat className="h-4 w-4" />
                  mocked
                </div>
                <div>
                  <Button
                    onClick={() => deleteFile({ id: file.id })}
                    variant="ghost"
                    size="sm"
                    className="text-destructive flex items-center gap-2 font-normal hover:bg-destructive/10 hover:text-destructive"
                  >
                    {/* Switching the delete button when deleting to a spinner */}
                    {currntlyDeletingFile === file.id ? (
                      <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icons.trash className="w-4 h-4" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : isLoading ? (
        <>
          <Skeleton className="h-24 my-2 bg-border" />
          <Skeleton className="h-24 my-2 bg-border" />
          <Skeleton className="h-24 my-2 bg-border" />
        </>
      ) : (
        <section className="mt-16 flex flex-col items-center gap-2">
          <Icons.ghost className="w-8 h-8 text-foreground/80" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let's upload ypur first PDF.</p>
        </section>
      )}
    </main>
  );
}
