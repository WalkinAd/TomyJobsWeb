import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCawwEPnQ4QSVoC423nQlL2znKbodamgks",
  authDomain: "to-my-jobs.firebaseapp.com",
  projectId: "to-my-jobs",
  storageBucket: "to-my-jobs.appspot.com",
  messagingSenderId: "540166116804",
  appId: "1:540166116804:web:31d50716a90a57a994c091",
  measurementId: "G-7S34CKBGST"
};

let app: FirebaseApp;
let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  analytics = getAnalytics(app);
} else {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
}

export { app, analytics };

