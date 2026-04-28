import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId,
);

let appInstance: ReturnType<typeof initializeApp> | null = null;
let authInstance: Auth | null = null;

let analyticsInstance: Analytics | null = null;

function getClientApp() {
  if (typeof window === "undefined" || !isFirebaseConfigured) {
    return null;
  }

  if (appInstance) {
    return appInstance;
  }

  appInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return appInstance;
}

export function getClientAuth(): Auth | null {
  if (typeof window === "undefined" || !isFirebaseConfigured) {
    return null;
  }

  if (authInstance) {
    return authInstance;
  }

  const app = getClientApp();
  if (!app) {
    return null;
  }

  try {
    authInstance = getAuth(app);
    return authInstance;
  } catch {
    return null;
  }
}

export async function initAnalytics(): Promise<Analytics | null> {
  const app = getClientApp();
  if (!app) return null;
  if (analyticsInstance) return analyticsInstance;
  const supported = await isSupported();
  if (!supported) return null;
  analyticsInstance = getAnalytics(app);
  return analyticsInstance;
}
