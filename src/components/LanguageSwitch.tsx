"use client";

import { Link, usePathname } from "@/lib/navigation";
import Image from "next/image";
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import { useLocale } from "next-intl";

// LanguageSwitch component can only be used in the parent Menubar component
export default function LanguageSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const language = locale === "ua" ? "Українська" : "English";

  return (
    <MenubarMenu>
      <MenubarTrigger className="cursor-pointer flex gap-1">
        <Image
          src={
            locale === "ua"
              ? "/ukraine-flag-icon.svg"
              : "/united-kingdom-flag-icon.svg"
          }
          width={15}
          height={15}
          alt={`${language}`}
        />
        {language}
      </MenubarTrigger>
      <MenubarContent className="min-w-fit">
        <MenubarItem>
          <Link href={pathname} locale="en" className="w-full flex gap-1">
            <Image
              src="/united-kingdom-flag-icon.svg"
              width={15}
              height={15}
              alt="united kingdom flag"
            />
            English
          </Link>
        </MenubarItem>
        <MenubarItem>
          <Link href={pathname} locale="ua" className="w-full flex gap-1">
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
  );
}
