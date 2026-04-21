import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported, logEvent as firebaseLogEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function hasFirebaseConfig() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}

function getFirebaseApp() {
  if (!hasFirebaseConfig()) {
    return null;
  }
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

export async function initAnalytics() {
  if (typeof window === 'undefined') {
    return null;
  }

  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  if (!(await isSupported())) {
    return null;
  }

  return getAnalytics(app);
}

export async function logEvent(eventName, params = {}) {
  try {
    const analytics = await initAnalytics();
    if (!analytics) return;
    firebaseLogEvent(analytics, eventName, params);
  } catch {
    // Ignore analytics failures to avoid blocking core app behavior.
  }
}
