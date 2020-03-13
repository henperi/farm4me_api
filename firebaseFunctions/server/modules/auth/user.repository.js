// /**
//  * @typedef {(import("../../models").Firestore)} Firestore
//  */
import { log } from 'util';
import { Container } from 'typedi';

import { fireDb, collections } from '../../models';
import { hashPassword } from '../../helpers/passwordHelpers';

/**
 * @typedef {typeof Container} DiContainer
 */

/**
 * This is the user repository
 */
export class UserRepo {
  /**
   * @param {DiContainer} container
   */
  constructor(container) {
    /**
     * @type {FirebaseFirestore.Firestore}
     */
    this.db = container.get('fireDb');
    this.User = this.db.collection(collections.User);
  }

  /**
   * method to get a user by email
   *  @param {string} email
   *
   *  @returns {Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>>} user
   */
  async getByEmail(email) {
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
  async create(userData) {
    try {
      const password = hashPassword(userData.password);

      return await this.User.add({
        firstName: userData.firstName,
        phone: userData.phone,
        email: userData.email,
        password,
        createdAt: Date.now(),
      });
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }
}

Container.set('fireDb', fireDb);
Container.set(UserRepo, new UserRepo(Container));
