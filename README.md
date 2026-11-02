# Ledgerline Expense Tracker

Responsive personal finance website with Firebase Authentication and per-account Cloud Firestore sync. Transactions, budgets, and theme preferences follow the signed-in user across devices.

## Run the website

1. Install Node.js 20.19+ or 22.12+.
2. Double-click **Start Ledgerline.bat** (or run `npm install` and then `npm run dev` in this folder).
3. Create `.env.local` from `.env.example` and add the Firebase web app config values.
4. Open the local URL printed by Vite. Do not open `index.html` directly from the file system.

Do not open `index.html` directly from the file system. Firebase modules need the Vite web server. `npm run build` creates the deployable site in `dist/`; provide the same `VITE_FIREBASE_*` values when building for hosting.

## Firebase project setup

1. In the Firebase Console, create or open a project and register a Web app. Copy its web configuration values into `.env.local`.
2. In **Authentication → Sign-in method**, enable **Email/Password** and **Google**. Add the local and deployed website domains to **Authorized domains**.
3. Create a Cloud Firestore database.
4. Publish the included `firestore.rules` to that database before using the app.
5. Run the website again. Users can create an account or sign in with Google, reset a forgotten password, and sign out from the account control in the sidebar.

The web app config is client-side project identification, not a service-account secret. Never put service account keys in this website. Restrict access with Firebase Authentication and Firestore Rules; the rules allow each signed-in user to access only their own `users/{uid}` records.

The app stores transactions at `users/{uid}/transactions/{transactionId}`, budgets at `users/{uid}/budgets/main`, and preferences at `users/{uid}/settings/preferences`. Firestore listeners keep the current account up to date across signed-in devices. On the first sign-in, if this browser has local records but the Firebase account is empty, the app asks before importing them. Records are not uploaded until the user chooses **Import this device**.

## Features

- Email/password registration and sign-in, Google sign-in, password reset, persistent sessions, and logout.
- User-private Firestore data with live sync.
- Responsive overview, transactions, budgets, analytics, and reports.
- Income and expense management, search and filters, rule-based insights, and Excel/CSV exports.
- Light and dark themes.

## Notes

The site supports mobile browsers; it is not a native Expo application. Currency display is currently INR. Receipt uploads and account deletion are not implemented.
