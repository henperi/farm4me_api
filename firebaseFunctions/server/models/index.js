import admin from 'firebase-admin';

import serviceAccount from '../../serviceAccount.json';

admin.initializeApp({
  // @ts-ignore
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://farm4me-484cb.appspot.com/',
});

/**
  @typedef {fireDb} Firestore
*/
export const fireDb = admin.firestore();
export const storageBucket = admin.storage().bucket();

/**
 * The db collections
 */
class Collections {
  constructor() {
    this.User = 'User';
    this.Profile = 'Profile';
    this.Project = 'Project';
    this.UserStats = 'UserStats';
  }
}

export const collections = new Collections();
