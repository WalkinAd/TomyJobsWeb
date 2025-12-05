export const FIREBASE_DATABASE = {
  DEFAULT: "(default)",
  PROD: "prod",
} as const;

export type FirebaseDatabaseId =
  (typeof FIREBASE_DATABASE)[keyof typeof FIREBASE_DATABASE];
