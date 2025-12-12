'use client';

import { Provider } from 'react-redux';
import { store } from "@/shared/store/store";
import { StoreProvider } from "@/shared/store/StoreProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StoreProvider>
        {children}
      </StoreProvider>
    </Provider>
  );
}

