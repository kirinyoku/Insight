import { useTranslations } from "next-intl";
import Container from "./layout/Container";
import { Icons } from "./ui/icons";

export default function Footer() {
  const i18n = useTranslations("Index");

  return (
    <footer className="w-full h-16 bg-accent border-t-2 border-border">
      <Container>
        <div className="flex justify-between items-center text-center md:text-left h-16 gap-4">
          <p className="text-foreground/70">
            © 2023 {i18n("footer.design")}
            <a
              href="https://github.com/joschan21"
              target="_blank"
              className="text-primary hover:underline"
            >
              Josh
            </a>
            , {i18n("footer.development")}
            <a
              href="https://github.com/kirinyoku"
              target="_blank"
              className="text-primary hover:underline"
            >
              Kirin
            </a>
          </p>
          <p>
            <a
              href="https://github.com/kirinyoku/Insight"
              target="_blank"
              className="flex items-center gap-2 hover:text-primary text-foreground/80"
            >
              GitHub <Icons.gitHub className="h-6 w-6" />
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
