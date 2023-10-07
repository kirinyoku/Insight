import Link from "next/link";
import Image from "next/image";
import Container from "@/components/layout/Container";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function Home() {
  const i18n = useTranslations("Index");

  return (
    <>
      {/* call to action section */}
      <Container className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <div
          role="banner"
          className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full borded border-border bg-white px-7 py-2 shadow-md shadow-primary/50 backdrop-blur"
        >
          <p className="text-sm font-semibold text-gray-700">
            {i18n("banner")}
          </p>
        </div>
        <h1 className="max-w-3xl text-3xl font-bold md:text-5xl lg:text-6xl">
          {i18n("headline")}{" "}
          <span className="bg-gradient-to-r from-primary to-[#049458] bg-clip-text text-transparent">
            Insight
          </span>
        </h1>
        <p className="mt-7 max-w-prose text-foreground/60 sm:text-lg">
          {i18n("description")}
        </p>
        <Link
          href="/dashboard"
          target="_blank"
          className={buttonVariants({
            size: "lg",
            className: "mt-5",
          })}
        >
          {i18n("cta-button")} <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Container>

      <section>
        {/* decorative element for a gradient background */}
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              className="'relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#a9ffca] to-[#1b886a] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>

          {/* preview image block */}
          <div>
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mt-12 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-foreground/5 p-2 ring-1 ring-inset ring-ring/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <Image
                    src="/preview.jpg"
                    alt="preview"
                    width={1364}
                    height={866}
                    quality={100}
                    className="rounded-md bg-background p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-ring/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* the same decorative element with slight changes */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              className="'relative left-[calc(50%-15rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#a9ffca] to-[#1b886a] opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
      </section>

      {/* benefits section */}
      <section className="mx-auto my-24 max-w-5xl">
        <div className="px-6 lg:px-8">
          <h2 className="my-4 font-bold text-4xl text-foreground sm:text-center sm:text-5xl">
            {i18n("benefits.title")}
          </h2>
          <p className="sm:text-center text-lg text-foreground/60 mb-4">
            {i18n("benefits.subtitle")}
          </p>
          <ol className="flex flex-col gap-3">
            <li className="border-l-8 border-l-primary bg-primary/30 p-2">
              <h3 className="text-2xl text-foreground font-semibold mb-1">
                {i18n("benefits.benefit-1.title")}
              </h3>
              <p className="text-xl text-foreground/80">
                {i18n("benefits.benefit-1.description")}
              </p>
            </li>
            <li className="border-l-8 border-l-primary bg-primary/30 p-2">
              <h3 className="text-2xl text-foreground font-semibold mb-1">
                {i18n("benefits.benefit-2.title")}
              </h3>
              <p className="text-xl text-foreground/80">
                {i18n("benefits.benefit-2.description")}
              </p>
            </li>
            <li className="border-l-8 border-l-primary bg-primary/30 p-2">
              <h3 className="text-2xl text-foreground font-semibold mb-1">
                {i18n("benefits.benefit-3.title")}
              </h3>
              <p className="text-xl text-foreground/80">
                {i18n("benefits.benefit-3.description")}
              </p>
            </li>
            <li className="border-l-8 border-l-primary bg-primary/30 p-2">
              <h3 className="text-2xl text-foreground font-semibold mb-1">
                {i18n("benefits.benefit-4.title")}
              </h3>
              <p className="text-xl text-foreground/80">
                {i18n("benefits.benefit-4.description")}
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* guide section */}
      <section className="mx-auto mb-24 max-w-5xl">
        <div className="mb-0 sm:mb-8 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="my-4 font-bold text-4xl text-foreground sm:text-5xl">
              {i18n("guide.title")}
            </h2>
            <p className="text-foreground/80 text-lg">
              {i18n("guide.subtitle")}
            </p>
          </div>
        </div>
        <ol className="mb-8 space-y-4 pt-4 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-border py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-primary">
                {i18n("guide.steps.step")} 1
              </span>
              <span className="text-xl font-semibold">
                {i18n("guide.steps.step-1.title")}
              </span>
              <span className="mt-2 text-foreground/80">
                {i18n("guide.steps.step-1.description")}{" "}
                <Link
                  href="/pricing"
                  className="text-primary underline underline-offset-2"
                >
                  {i18n("guide.steps.step-1.link")}
                </Link>
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-border py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-primary">
                {i18n("guide.steps.step")} 2
              </span>
              <span className="text-xl font-semibold">
                {i18n("guide.steps.step-2.title")}
              </span>
              <span className="mt-2 text-foreground/80">
                {i18n("guide.steps.step-2.description")}
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-border py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-primary">
                {i18n("guide.steps.step")} 3
              </span>
              <span className="text-xl font-semibold">
                {i18n("guide.steps.step-3.title")}
              </span>
              <span className="mt-2 text-foreground/80">
                {i18n("guide.steps.step-3.description")}
              </span>
            </div>
          </li>
        </ol>

        {/* example image block */}
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-foreground/5 p-2 ring-1 ring-inset ring-ring/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src="/file-upload-preview.jpg"
                alt="uploading preview"
                width={1419}
                height={732}
                quality={100}
                className="rounded-md bg-background p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-ring/10"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
