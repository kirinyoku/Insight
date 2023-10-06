import Link from "next/link";
import Container from "./layout/Container";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import { useLocale } from "next-intl";
import Image from "next/image";

export default function Navbar() {
  const locale = useLocale();
  const language = locale === "ua" ? "Українська" : "English";

  return (
    <nav>
      <Container>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span className="bg-gradient-to-r from-primary to-[#049458] bg-clip-text text-transparent text-lg">
              Insight
            </span>
          </Link>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer flex gap-1">
                <Image
                  src={
                    locale === "ua"
                      ? "ukraine-flag-icon.svg"
                      : "united-kingdom-flag-icon.svg"
                  }
                  width={15}
                  height={15}
                  alt={`${language}`}
                />
                {language}
              </MenubarTrigger>
              <MenubarContent className="min-w-fit">
                <MenubarItem>
                  <Link href="/en" className="w-full flex gap-1">
                    <Image
                      src="/united-kingdom-flag-icon.svg"
                      width={15}
                      height={15}
                      alt="ukraine flag"
                    />
                    English
                  </Link>
                </MenubarItem>
                <MenubarItem>
                  <Link href="/ua" className="w-full flex gap-1">
                    <Image
                      src="/ukraine-flag-icon.svg"
                      width={15}
                      height={15}
                      alt="ukraine flag"
                    />
                    Українська
                  </Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </Container>
    </nav>
  );
}
