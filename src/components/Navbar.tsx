import Link from "next/link";
import Container from "./layout/Container";
import LanguageSwitch from "./LanguageSwitch";
import ThemeSwitch from "./ThemeSwitch";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Menubar } from "./ui/menubar";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const i18n = useTranslations("Index");

  return (
    <nav className="sticky inset-x-0 top-0 z-50 w-full border-b border-b-border h-14 bg-background/60 backdrop-blur-lg transition-all">
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
          <div className="flex gap-10 items-center">
            <Menubar>
              {/* LanguageSwitch and ThemeSwitch return ManubarMenu as parent component */}
              <LanguageSwitch />
              <ThemeSwitch />
            </Menubar>
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
          </div>
        </div>
      </Container>
    </nav>
  );
}
