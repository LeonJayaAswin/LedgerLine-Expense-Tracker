import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence, createUserWithEmailAndPassword, getAuth,
  GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail,
  setPersistence, signInWithEmailAndPassword, signInWithPopup, signOut,
  updateProfile,
} from 'firebase/auth';
import {
  collection, deleteDoc, doc, getFirestore, onSnapshot, serverTimestamp,
  setDoc,
} from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

export const firebaseEnabled = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
const firebaseApp = firebaseEnabled ? initializeApp(config) : null;
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
const db = firebaseApp ? getFirestore(firebaseApp) : null;
const googleProvider = new GoogleAuthProvider();

const keepSession = () => setPersistence(auth, browserLocalPersistence);
export const watchAuth = callback => onAuthStateChanged(auth, callback);
export const signInEmail = async (email, password) => { await keepSession(); return signInWithEmailAndPassword(auth, email, password); };
export const createEmailAccount = async (name, email, password) => {
  await keepSession();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() });
  return credential;
};
export const signInGoogle = async () => { await keepSession(); return signInWithPopup(auth, googleProvider); };
export const resetPassword = email => sendPasswordResetEmail(auth, email);
export const logOut = () => signOut(auth);

export function watchUserData(uid, onData, onError) {
  const data = { transactions: [], budgets: {}, theme: 'light' };
  const ready = new Set();
  const emit = key => snapshot => {
    if (key === 'transactions') data.transactions = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
    if (key === 'budgets') data.budgets = snapshot.exists() ? (snapshot.data().values || {}) : {};
    if (key === 'settings') data.theme = snapshot.exists() ? (snapshot.data().theme || 'light') : 'light';
    ready.add(key);
    if (ready.size === 3) onData(structuredClone(data));
  };
  const fail = error => onError(error);
  const stopTransactions = onSnapshot(collection(db, 'users', uid, 'transactions'), emit('transactions'), fail);
  const stopBudgets = onSnapshot(doc(db, 'users', uid, 'budgets', 'main'), emit('budgets'), fail);
  const stopSettings = onSnapshot(doc(db, 'users', uid, 'settings', 'preferences'), emit('settings'), fail);
  return () => { stopTransactions(); stopBudgets(); stopSettings(); };
}

export async function syncUserData(uid, next, previous = { transactions: [], budgets: {}, theme: 'light' }) {
  const oldById = new Map((previous.transactions || []).map(item => [item.id, item]));
  const newById = new Map((next.transactions || []).map(item => [item.id, item]));
  const writes = [];
  for (const item of newById.values()) {
    const old = oldById.get(item.id);
    if (!old || JSON.stringify(old) !== JSON.stringify(item)) {
      const { id, ...values } = item;
      writes.push(setDoc(doc(db, 'users', uid, 'transactions', id), { ...values, updatedAt: serverTimestamp() }));
    }
  }
  for (const id of oldById.keys()) if (!newById.has(id)) writes.push(deleteDoc(doc(db, 'users', uid, 'transactions', id)));
  if (JSON.stringify(previous.budgets || {}) !== JSON.stringify(next.budgets || {})) {
    writes.push(setDoc(doc(db, 'users', uid, 'budgets', 'main'), { values: next.budgets || {}, updatedAt: serverTimestamp() }));
  }
  if ((previous.theme || 'light') !== (next.theme || 'light')) {
    writes.push(setDoc(doc(db, 'users', uid, 'settings', 'preferences'), { theme: next.theme || 'light', updatedAt: serverTimestamp() }, { merge: true }));
  }
  await Promise.all(writes);
}
