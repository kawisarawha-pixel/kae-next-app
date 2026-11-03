import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from './firebase-config-10071.json' with { type: 'json' }; // Generate new private key ภายใต้ Firebase console

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export default db;