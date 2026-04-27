import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

let analyticsInstance: Analytics | null = null;

export async function initAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") {
    return null;
  }

  if (analyticsInstance) {
    return analyticsInstance;
  }

  const supported = await isSupported();

  if (!supported) {
    return null;
  }

  analyticsInstance = getAnalytics(app);
  return analyticsInstance;
}
