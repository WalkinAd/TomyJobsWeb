import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";
import { FIREBASE_DATABASE } from "../constants/firebase.constants";

const getFirebaseConfig = () => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  if (
    !apiKey ||
    !authDomain ||
    !projectId ||
    !storageBucket ||
    !messagingSenderId ||
    !appId
  ) {
    throw new Error(
      "faltan variables de entorno de firebase. revisa tu archivo .env.local"
    );
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
  };
};

const firebaseConfig = getFirebaseConfig();

const getDatabaseId = (): string => {
  const envDbId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID;
  if (
    envDbId === FIREBASE_DATABASE.PROD ||
    envDbId === FIREBASE_DATABASE.DEFAULT
  ) {
    return envDbId;
  }
  return FIREBASE_DATABASE.DEFAULT;
};

let appInstance: FirebaseApp | null = null;
let analyticsInstance: Analytics | null = null;
let dbInstance: Firestore | null = null;

const getApp = (): FirebaseApp => {
  if (typeof window === "undefined") {
    if (!appInstance) {
      appInstance =
        getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    }
    return appInstance;
  }

  if (!appInstance) {
    appInstance =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return appInstance;
};

const getDb = (): Firestore => {
  if (!dbInstance) {
    const app = getApp();
    const databaseId = getDatabaseId();
    dbInstance = getFirestore(app, databaseId);
  }
  return dbInstance;
};

const getAnalyticsInstance = (): Analytics | null => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!analyticsInstance && firebaseConfig.measurementId) {
    const app = getApp();
    analyticsInstance = getAnalytics(app);
  }
  return analyticsInstance;
};

export const app = getApp();
export const analytics = getAnalyticsInstance();
export const db = getDb();
