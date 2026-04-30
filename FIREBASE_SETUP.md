# Firebase Live Setup Guide

## Current Status
✅ App is running with `NEXT_PUBLIC_FIREBASE_LIVE=true`  
⚠️ Firebase API key in `.env.local` is invalid (needs correction)  
✅ Backend fallback is working (announcements showing from `/api/announcements`)

## Step 1: Get Valid Firebase Credentials

### Option A: Use Existing Firebase Project
If you already have a Firebase project (e.g., `electionsupport-d3661`):

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`electionsupport-d3661`)
3. Click **⚙️ Project Settings** (gear icon, top left)
4. Select **Your apps** → Find your **web app** (should be listed)
5. Copy these values from the **Firebase SDK snippet**:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
   ```

### Option B: Create New Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Create a project** → name it `election-support-live`
3. Enable Google Analytics (optional)
4. Create project
5. Once created, click **+ Add app** → select **Web** (</> icon)
6. Register the app → copy the **config object**
7. Extract and use the credentials in `.env.local` (see Step 2)

---

## Step 2: Set Up Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Select **Start in production mode** (or test mode if developing)
4. Choose region: **us-central1** (or nearest to you)
5. Click **Create**

---

## Step 3: Create Firestore Collections & Sample Data

### Create `announcements` Collection

1. In Firestore, click **+ Create collection**
2. Name: `announcements`
3. Click **Next**
4. Add document with **Auto ID**:
   ```json
   {
     "title": "Voter Registration Deadline",
     "description": "Last date to register as a voter is June 15, 2026",
     "region": "national",
     "timestamp": "2026-05-01T10:00:00Z"
   }
   ```
5. Add another document:
   ```json
   {
     "title": "Rajasthan Voting Day",
     "description": "State elections scheduled for June 20, 2026",
     "region": "rajasthan",
     "timestamp": "2026-05-01T11:00:00Z"
   }
   ```

### Create `feedback` Collection

1. Click **+ Create collection**
2. Name: `feedback`
3. Click **Next**
4. Start with an empty collection (documents will be added by the app when users submit feedback)

---

## Step 4: Configure Firestore Security Rules

1. In Firestore, go to **Rules** tab
2. Replace the default rules with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow anyone to read announcements
       match /announcements/{document=**} {
         allow read: if true;
       }
       
       // Allow anyone to create and read feedback
       match /feedback/{document=**} {
         allow create: if request.resource.data.rating >= 1 && request.resource.data.rating <= 5;
         allow read: if true;
       }
     }
   }
   ```
3. Click **Publish**

---

## Step 5: Update Environment Variables

Edit `frontend/.env.local` and replace the Firebase section with your valid credentials:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY_HERE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=1:YOUR_SENDER_ID:web:YOUR_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-YOUR_MEASUREMENT_ID
NEXT_PUBLIC_FIREBASE_ANNOUNCEMENTS_COLLECTION=announcements
NEXT_PUBLIC_FIREBASE_FEEDBACK_COLLECTION=feedback
NEXT_PUBLIC_FIREBASE_LIVE=true
```

---

## Step 6: Restart Dev Server

After updating `.env.local`:

```bash
# In the frontend directory:
npm run dev
```

The app will automatically reload with the new credentials.

---

## Step 7: Verify Live Firebase is Working

1. Open http://localhost:3001 in browser
2. Go to homepage → check **Google Services Hub** section
3. You should see:
   - ✅ Announcements loading from Firestore (no "Loading..." message)
   - ✅ Sample announcements displayed ("Voter Registration Deadline", "Rajasthan Voting Day")
   - ✅ No Firebase console errors (only warnings are OK)

4. Test feedback submission:
   - Fill the **feedback form** with rating + comment
   - Click **Send feedback**
   - Check Firestore **feedback** collection → new document should appear

---

## Troubleshooting

### "API key not valid" Error
- ❌ **Cause**: API key in `.env.local` doesn't match your Firebase project
- ✅ **Fix**: Copy the exact API key from Firebase Console Project Settings

### Announcements still show "Loading..."
- ❌ **Cause**: Firestore is not reachable or Security Rules are blocking reads
- ✅ **Fix**: 
  - Verify Firestore database is created and active
  - Check Security Rules allow `read` on announcements collection
  - Verify `.env.local` has correct `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

### Feedback not saving to Firestore
- ❌ **Cause**: Security Rules or collection doesn't exist
- ✅ **Fix**:
  - Verify `feedback` collection exists in Firestore
  - Check Security Rules allow `create` on feedback collection
  - Inspect browser console for Firebase errors

### "Measurement ID not found" Warning
- ⚠️ **Cause**: Analytics measurement ID missing or invalid
- ✅ **Fix**: Ensure `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` is correctly set from Firebase Console

---

## What Happens If Firebase Fails?

The app has a **built-in fallback** — if Firebase is disabled or unavailable:
- ✅ Announcements load from backend `/api/announcements` endpoint
- ✅ Feedback is stored in backend memory (in-memory, resets on server restart)
- ✅ Users see no errors; experience is seamless

This is why the app is already working even with invalid credentials!

---

## Production Deployment Note

When deploying to production:
1. Create a **separate Firebase project** for production
2. Update environment variables in your hosting platform (Vercel, Netlify, etc.)
3. Set `NEXT_PUBLIC_FIREBASE_LIVE=true` in production environment
4. Firestore will automatically scale to handle production traffic

---

## Need Help?

- Firebase Console: https://console.firebase.google.com
- Firebase Docs: https://firebase.google.com/docs
- Firestore Security Rules: https://firebase.google.com/docs/firestore/security/start
