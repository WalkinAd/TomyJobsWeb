"use client";

import { useLocale } from "./useLocale";

export function useTranslations(namespace: string) {
  const { messages } = useLocale();

  const t = (key: string): string => {
    if (!messages || Object.keys(messages).length === 0) {
      return key;
    }

    const keys = key.split(".");
    let value: any = messages;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return t(fullKey);
  };
}
