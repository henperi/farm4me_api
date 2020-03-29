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

/**
 * The db collections
 */
class Collections {
  constructor() {
    this.User = 'User';
    this.Profile = 'Profile';
    this.Project = 'Project';
  }
}

export const collections = new Collections();
