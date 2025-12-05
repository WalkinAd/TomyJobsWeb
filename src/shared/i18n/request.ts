import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  let locale = requestedLocale || defaultLocale;

  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
