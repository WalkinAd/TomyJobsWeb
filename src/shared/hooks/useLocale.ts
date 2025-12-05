"use client";

import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { setLocale, loadMessages } from "@/shared/store/slices/locale.slice";

export function useLocale() {
  const dispatch = useAppDispatch();
  const { locale, messages } = useAppSelector((state) => state.locale);

  return {
    locale,
    messages: messages || {},
    setLocale: (newLocale: "es" | "en") => {
      dispatch(setLocale(newLocale));
      dispatch(loadMessages(newLocale));
    },
  };
}
