# Ledgerline Expense Tracker

A responsive personal finance tracker for the browser. It includes transaction management, monthly dashboard and charts, category budgets, rule based insights, and Excel/CSV report downloads.

## Run it

Open `index.html` in a modern browser. No build step is required. A new workspace starts blank. Existing starter/demo transactions from the earlier version are removed automatically while any transactions you added are kept. Your records remain in this browser's local storage and are not sent to a server.

The Excel workbook is generated with SheetJS loaded from jsDelivr. An internet connection is needed for the workbook export library and web fonts. CSV export and transaction entry work without that library. The app uses INR as its display currency; don't mix amounts in different currencies.

## Included

- Responsive dashboard with month selection, cash flow chart, category breakdown, recent entries, and monthly budget progress.
- Add/edit/delete income and expenses, search, filters, payment methods, notes, duplicate warning, and input validation.
- Overall and per-category monthly budgets.
- Data-derived spending insights that stay empty until there is enough recorded activity.
- Four-sheet Excel exports (summary, transactions, categories, daily summary) and CSV exports for a chosen month, previous month, custom date range, or year.
- Light and dark themes, mobile navigation, and a quick-add control.

## Data and production setup

This folder is a local browser MVP. Firebase Authentication, Firestore synchronization, account recovery, cloud security rules, receipt storage, and native Expo apps are **not connected**. The app must not be presented as providing cloud backup or multi-device sync. Don't enter sensitive financial data if you need cloud storage or authenticated access.

For a production build, connect Firebase Auth (Google and email/password) and store each user's records under `users/{uid}/transactions`, `users/{uid}/budgets`, `users/{uid}/categories`, and `users/{uid}/settings`. Enforce ownership in Firestore rules before enabling writes. A starter rule file is included for review; deploy only after configuring Firebase and testing it against your actual data model. Never commit Firebase service account credentials. Firebase web client configuration is public project metadata, but access must still be protected by Auth, rules, and App Check as appropriate.

## Mobile

The web layout is responsive and has a compact bottom quick-add action. It is not a native mobile application. A separate Expo/React Native client can share transaction and report data contracts once a cloud backend is configured.
