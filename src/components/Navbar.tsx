import Link from "next/link";
import Container from "./layout/Container";
import LanguageSwitch from "./LanguageSwitch";
import ThemeSwitch from "./ThemeSwitch";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Menubar } from "./ui/menubar";

export default function Navbar() {
  return (
    <nav>
      <Container>
        <div className="flex h-14 items-center justify-between border-b border-border">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "link" }),
              "flex z-40 font-semibold"
            )}
          >
            <span className="bg-gradient-to-r from-primary to-[#049458] bg-clip-text text-transparent text-lg">
              Insight
            </span>
          </Link>
          <Menubar>
            {/* LanguageSwitch and ThemeSwitch return ManubarMenu as parent component */}
            <LanguageSwitch />
            <ThemeSwitch />
          </Menubar>
        </div>
      </Container>
    </nav>
  );
}
