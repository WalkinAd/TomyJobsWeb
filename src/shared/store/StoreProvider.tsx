'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { loadMessages } from './slices/locale.slice';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { locale, messages } = useAppSelector((state) => state.locale);

  useEffect(() => {
    if (Object.keys(messages).length === 0) {
      dispatch(loadMessages(locale));
    }
  }, [locale, messages, dispatch]);

  return <>{children}</>;
}

