import { Icons } from "@/components/ui/icons";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const i18n = useTranslations("not-found");
  return (
    <main className="w-full h-[calc(100vh-3.5rem)]">
      <section className="flex flex-col gap-4 h-full w-full justify-center items-center p-12">
        <Icons.bird className="h-28 w-28" />
        <h2 className="text-2xl md:text-3xl font-semibold text-center uppercase">
          {i18n("title")}
        </h2>
      </section>
    </main>
  );
}
