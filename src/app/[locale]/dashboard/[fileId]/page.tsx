import { db } from "@/db";
import { notFound, redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import PdfViewer from "@/components/PdfViewer";
import ChatWrapper from "@/components/ChatWrapper";

interface FilePageProps {
  params: {
    fileId: string;
  };
}

export default async function FilePage({ params }: FilePageProps) {
  const { fileId } = params;
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user?.id) redirect(`/auth-callback?origin=dashboard/${fileId}`);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) notFound();

  return (
    <main className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        <section className="flex-1 xl:flex">
          <div className="py-2 sm:px-6 lg:px-4 xl:flex-1 xl:px-4">
            <PdfViewer url={file.url} />
          </div>
        </section>
        <section className="shrink-0 flex-[0.9] border-t border-border lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={file.id} />
        </section>
      </div>
    </main>
  );
}
