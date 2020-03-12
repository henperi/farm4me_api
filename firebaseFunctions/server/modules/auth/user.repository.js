/**
 * @typedef {(import("../../models").Firestore)} Firestore
 */

import { log } from 'util';
import { fireDb } from '../../models';


/**
 * This is the user repository
 */
export class UserRepo {
  // /**
  //  * @param {Firestore} db
  //  */
  // constructor(db) {
  //   this.db = db;
  //   this.User = this.db.collection('User');
  // }
  /**
   *
   */
  static get User() { return fireDb.collection('User'); }

  /**
   * method to get a user by email
   *  @param {string} email
   *
   *  @returns {Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>>} user
   */
  static async getByEmail(email) {
    try {
      return await this.User.where('email', '==', email).get();
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }

  /**
   * method to get a user by email
   *  @param {object} userData
   *
   *  @returns {Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>>} user
   */
  static async create(userData) {
    try {
      return await this.User.add({
        phone: userData.phone,
        email: userData.email,
        password: userData.password,
        createdAt: Date.now(),
      });
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }
}
