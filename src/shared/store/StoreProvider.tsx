'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { loadMessages } from './slices/locale.slice';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { locale, messages } = useAppSelector((state) => state.locale);

  useEffect(() => {
    const localeFromStore = locale;
    const currentMessages = messages;
    
    if (localeFromStore !== "es" || Object.keys(currentMessages).length === 0) {
      dispatch(loadMessages(localeFromStore));
    }
  }, [locale, dispatch]);

  return <>{children}</>;
}

