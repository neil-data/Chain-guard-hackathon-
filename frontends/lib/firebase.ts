import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAwg_8SXYLMQSjMi2Xk6TJ03lsCWcU41dI",
  authDomain: "my-projet-94231.firebaseapp.com",
  projectId: "my-projet-94231",
  storageBucket: "my-projet-94231.firebasestorage.app",
  messagingSenderId: "492954895687",
  appId: "1:492954895687:web:d172a5923206af22af7862",
  measurementId: "G-HWMTE0RRK5",
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