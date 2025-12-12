import { Timestamp } from "firebase/firestore";

export const formatJobDate = (
  timestamp: Timestamp | Date | string | null | undefined,
  locale: string = "es"
): string => {
  if (!timestamp) return "";

  let date: Date;

  if (typeof timestamp === "string") {
    date = new Date(timestamp);
  } else if (
    timestamp &&
    typeof timestamp === "object" &&
    "toDate" in timestamp
  ) {
    date = (timestamp as Timestamp).toDate();
  } else {
    date = timestamp as Date;
  }

  const localeMap: Record<string, string> = {
    es: "es-ES",
    en: "en-US",
  };

  const dateLocale = localeMap[locale] || localeMap.es;

  return new Intl.DateTimeFormat(dateLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const getDaysLeft = (expireTimestamp?: string): number | null => {
  if (!expireTimestamp) return null;

  const expireDate = new Date(expireTimestamp);
  const now = new Date();
  const diff = expireDate.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return days > 0 ? days : null;
};

export const getCountryFromLocation = (location?: string): string => {
  if (!location) return "";

  const parts = location.split(",").map((p) => p.trim());
  return parts[parts.length - 1] || "";
};

export const getJobImageUrl = (banner?: string[]): string => {
  const defaultImage =
    "https://tse1.mm.bing.net/th?id=OIP.PPBMLiYljuluJZtFxAZwDQHaHa&pid=Api&rs=1&c=1&qlt=95&h=180";
  return banner && banner.length > 0 ? banner[0] : defaultImage;
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const parseJobSlug = (
  slug: string
): { locator: string; jobTitle?: string } | null => {
  if (!slug) return null;

  const cleanSlug = slug.replace(/\/$/, "").trim();
  const parts = cleanSlug.split("/");

  if (parts.length < 1) return null;

  const locator = parts[parts.length - 1].trim();
  const jobTitle = parts.length > 1 ? parts.slice(0, -1).join("/") : undefined;

  if (!locator) return null;

  return {
    locator,
    jobTitle,
  };
};

export const generateJobUrl = (
  categorySlug: string,
  jobTitle: string,
  locator: string,
  subCategorySlug?: string
): string => {
  const titleSlug = slugify(jobTitle);
  const jobSlug = `${titleSlug}/${locator}`;

  if (subCategorySlug) {
    return `/${categorySlug}/${subCategorySlug}/${jobSlug}`.replace(/\/$/, "");
  }

  return `/${categorySlug}/${jobSlug}`.replace(/\/$/, "");
};
