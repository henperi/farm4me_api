import admin from 'firebase-admin';

// @ts-ignore
import serviceAccount from '../../serviceAccount.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
  @typedef {fireDb} Firestore
*/
export const fireDb = admin.firestore();
