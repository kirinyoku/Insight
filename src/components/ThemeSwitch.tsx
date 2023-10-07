"use client";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import { Icons } from "./ui/icons";
import { useTranslations } from "next-intl";
import useTheme from "@/hooks/useTheme";

// ThemeSwitch component can only be used in the parent Menubar component
export default function ThemeSwitch() {
  const i18n = useTranslations("Index");
  const [theme, setTheme] = useTheme();

  return (
    <MenubarMenu>
      <MenubarTrigger className="cursor-pointer capitalize">
        {theme === "light" ? (
          <Icons.sun className="w-4 h-4" />
        ) : (
          <Icons.moon className="w-4 h-4" />
        )}
      </MenubarTrigger>
      <MenubarContent className="min-w-fit">
        <MenubarItem
          onClick={() => setTheme("light")}
          className="flex gap-1 pr-5 items-center cursor-pointer capitalize"
        >
          <Icons.sun className="w-4 h-4" />
          {i18n("navbar.theme.light")}
        </MenubarItem>
        <MenubarItem
          onClick={() => setTheme("dark")}
          className="flex gap-1 pr-5 items-center cursor-pointer capitalize"
        >
          <Icons.moon className="w-4 h-4" />
          {i18n("navbar.theme.dark")}
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
}
