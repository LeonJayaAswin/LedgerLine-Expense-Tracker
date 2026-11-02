# Ledgerline Expense Tracker

Responsive personal finance website with Firebase Authentication and per-account Cloud Firestore sync. Transactions, budgets, and theme preferences follow the signed-in user across devices.

## Run the website

1. Install Node.js 20.19+ or 22.12+.
2. Double-click **Start Ledgerline.bat** (or run `npm install` and then `npm run dev -- --host localhost` in this folder).
3. Create `.env.local` from `.env.example` and add the Firebase web app config values.
4. Open the local URL printed by Vite. Do not open `index.html` directly from the file system.

Do not open `index.html` directly from the file system. Firebase modules need the Vite web server. `npm run build` creates the deployable site in `dist/`; provide the same `VITE_FIREBASE_*` values when building for hosting.

## Firebase project setup

1. In the Firebase Console, create or open a project and register a Web app. Copy its web configuration values into `.env.local`.
2. In **Authentication → Sign-in method**, enable **Email/Password** and **Google**. In **Authentication → Settings → Authorized domains**, add `localhost` and your deployed website domain. The launcher opens `http://localhost:5173`; avoid `127.0.0.1` for Google sign-in.
3. Create a Cloud Firestore database.
4. Publish the included `firestore.rules` to that database before using the app.
5. Run the website again. Users can create an account or sign in with Google, reset a forgotten password, and sign out from the account control in the sidebar.

The web app config is client-side project identification, not a service-account secret. Never put service account keys in this website. Restrict access with Firebase Authentication and Firestore Rules; the rules allow each signed-in user to access only their own `users/{uid}` records.

The app stores transactions at `users/{uid}/transactions/{transactionId}`, budgets at `users/{uid}/budgets/main`, and preferences at `users/{uid}/settings/preferences`. Firestore listeners keep the current account up to date across signed-in devices. On the first sign-in, if this browser has local records but the Firebase account is empty, the app asks before importing them. Records are not uploaded until the user chooses **Import this device**.

## Features

- Email/password registration and sign-in, Google sign-in, password reset, persistent sessions, and logout.
- User-private Firestore data with live sync.
- Responsive overview, transactions, budgets, analytics, reports, and account settings.
- Income and expense management, search and filters, rule-based insights, and Excel/CSV exports.
- Light and dark themes, three text sizes, compact transaction lists, and a default payment method.

## Notes

The site supports mobile browsers; it is not a native Expo application. Currency display is currently INR. Receipt uploads and account deletion are not implemented.

## Deploy to Vercel

The local `.env.local` file is ignored by Git and is not sent to Vercel. In the Vercel project, open **Settings → Environment Variables** and add each variable below with the matching value from `.env.local`:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`

Apply them to Production (and Preview if needed), then redeploy. In Firebase Console, add the Vercel deployment hostname (for example, `your-project.vercel.app`) under **Authentication → Settings → Authorized domains**. Enter only the hostname, without `https://`, a path, or a trailing slash. Make sure the Google and Email/Password providers are enabled and your Firestore rules are published.
