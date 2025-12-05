import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Locale } from "@/shared/i18n/config";
import esMessages from "@/shared/i18n/messages/es.json";

interface LocaleState {
  locale: Locale;
  messages: any;
}

const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") return "es";
  const saved = localStorage.getItem("locale") as Locale;
  if (saved && ["es", "en"].includes(saved)) return saved;
  return "es";
};

export const loadMessages = createAsyncThunk(
  "locale/loadMessages",
  async (locale: Locale) => {
    try {
      const msgs = await import(`@/shared/i18n/messages/${locale}.json`);
      return msgs.default;
    } catch {
      const msgs = await import(`@/shared/i18n/messages/es.json`);
      return msgs.default;
    }
  }
);

const initialState: LocaleState = {
  locale: getInitialLocale(),
  messages: esMessages,
};

const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("locale", action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadMessages.fulfilled, (state, action) => {
      state.messages = action.payload;
    });
  },
});

export const { setLocale } = localeSlice.actions;
export default localeSlice.reducer;
