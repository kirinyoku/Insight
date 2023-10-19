import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Icons } from "./ui/icons";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { useTranslations } from "next-intl";

interface UserMenuProps {
  name: string;
  email: string | undefined;
  imageUrl: string | undefined;
}

export default function UserMenu({ email, imageUrl, name }: UserMenuProps) {
  const i18n = useTranslations("Index.navbar");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button className="rounded-full h-9 w-9 aspect-square bg-accent">
          <Avatar className="relative w-9 h-9">
            {imageUrl ? (
              <div className="relative aspect-square h-full w-full">
                <Image
                  fill
                  src={imageUrl}
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <AvatarFallback>
                <span className="sr-only">{name}</span>
                <Icons.user className="h-4 w-4 text-foreground" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            {name && (
              <p className="font-medium text-sm text-foreground">{name}</p>
            )}
            {email && (
              <p className="w-[200px] truncate text-xs text-foreground/70">
                {email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard">{i18n("dashboard")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <LogoutLink>{i18n("auth.log-out")}</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
