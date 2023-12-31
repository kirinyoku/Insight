import Link from "next/link";
import Container from "./layout/Container";
import LanguageSwitch from "./LanguageSwitch";
import ThemeSwitch from "./ThemeSwitch";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Menubar } from "./ui/menubar";
import {
  RegisterLink,
  LoginLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { useTranslations } from "next-intl";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const i18n = useTranslations("Index");

  const { getUser } = getKindeServerSession();
  const user = getUser();

  return (
    <nav className="sticky inset-x-0 top-0 z-50 w-full border-b border-b-border h-14 bg-background/50 backdrop-blur-lg shadow-primary/10 shadow-lg transition-all">
      <Container>
        <div className="flex h-14 items-center justify-between border-b border-border">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "link" }),
              "flex z-40 font-semibold"
            )}
          >
            <span className="bg-gradient-to-r from-primary to-[#049458] bg-clip-text text-transparent text-2xl">
              Insight
            </span>
          </Link>
          <div className="flex justify-end items-center gap-2 sm:gap-4 w-full">
            <Menubar className="bg-background/50 max-w-fit hidden sm:flex">
              {/* LanguageSwitch and ThemeSwitch return ManubarMenu as parent component */}
              <LanguageSwitch />
              <ThemeSwitch />
            </Menubar>
            {user ? (
              <UserMenu
                name={
                  !user.given_name || !user.family_name
                    ? "Your Account"
                    : `${user.given_name} ${user.family_name}`
                }
                email={user.email ?? undefined}
                imageUrl={user.picture ?? undefined}
              />
            ) : (
              <div className="flex gap-3 items-center">
                <LoginLink
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  {i18n("navbar.auth.sign-in")}
                </LoginLink>
                <RegisterLink className={buttonVariants({ size: "sm" })}>
                  {i18n("navbar.auth.sign-up")}
                </RegisterLink>
              </div>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
}
