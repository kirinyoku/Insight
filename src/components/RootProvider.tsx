import { notFound } from "next/navigation";
import { NextIntlClientProvider, useLocale } from "next-intl";

interface RootProviderProps {
  children: React.ReactNode;
}

export default async function RootProvider({ children }: RootProviderProps) {
  // Validate that the incoming `locale` parameter is valid.
  const locale = useLocale();
  const locales = ["en", "ua"];
  const isValidLocale = locales.some((l) => l === locale);
  if (!isValidLocale) {
    notFound();
  }

  // Import and validation i18n messages for client components.
  let messages;
  try {
    messages = (await import(`@/i18n/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
