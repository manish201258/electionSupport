import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported, logEvent as firebaseLogEvent } from 'firebase/analytics';
import { fetchAnnouncements, submitFeedback as submitFeedbackApi } from './api';

const firebaseLive = process.env.NEXT_PUBLIC_FIREBASE_LIVE === 'true';

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
  if (!firebaseLive || !hasFirebaseConfig()) {
    return null;
  }
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

let firestorePromise;

async function getFirestoreDb() {
  if (typeof window === 'undefined' || !firebaseLive) {
    return null;
  }

  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  if (!firestorePromise) {
    firestorePromise = import('firebase/firestore')
      .then(({ getFirestore }) => getFirestore(app))
      .catch(() => null);
  }

  return firestorePromise;
}

export async function initAnalytics() {
  if (typeof window === 'undefined' || !firebaseLive) {
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

export async function submitFeedback({ page, region, rating, comment }) {
  try {
    const db = await getFirestoreDb();
    if (db) {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      await addDoc(
        collection(db, process.env.NEXT_PUBLIC_FIREBASE_FEEDBACK_COLLECTION || 'feedback'),
        {
          page: page || 'unknown',
          region: region || 'national',
          rating: Number(rating) || 0,
          comment: (comment || '').trim().slice(0, 250),
          createdAt: serverTimestamp(),
        }
      );
      await logEvent('feedback_submitted', { page, region, rating: Number(rating) || 0 });
      return { ok: true, source: 'firestore' };
    }

    throw new Error('Firestore unavailable');
  } catch {
    try {
      const response = await submitFeedbackApi({
        page: page || 'unknown',
        region: region || 'national',
        rating: Number(rating) || 0,
        comment: (comment || '').trim().slice(0, 250),
      });

      return { ok: Boolean(response.ok), source: 'backend' };
    } catch {
      return { ok: false, reason: 'write_failed' };
    }
  }
}

export async function fetchRecentAnnouncements() {
  try {
    const db = await getFirestoreDb();
    if (db) {
      const { collection, getDocs, limit, query } = await import('firebase/firestore');
      const q = query(
        collection(
          db,
          process.env.NEXT_PUBLIC_FIREBASE_ANNOUNCEMENTS_COLLECTION || 'announcements'
        ),
        limit(5)
      );
      const snapshot = await getDocs(q);

      const items = snapshot.docs.map((doc) => {
        const data = doc.data() || {};
        return {
          id: doc.id,
          title: data.title || 'Election update',
          description: data.description || 'No details available.',
          region: data.region || 'national',
        };
      });

      if (items.length > 0) {
        return items;
      }
    }

    const fallback = await fetchAnnouncements('national');
    return fallback.items || [];
  } catch {
    const fallback = await fetchAnnouncements('national').catch(() => ({ items: [] }));
    return fallback.items || [];
  }
}
