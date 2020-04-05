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
      return await this.User.where('email', '==', email).limit(1).get();
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }

  /**
   * method to get a user by email
   *  @param {string} phone
   *
   *  @returns {Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>>} user
   */
  async getByPhone(phone) {
    try {
      return await this.User.where('phone', '==', phone).limit(1).get();
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

  /**
   *  Runs a Transaction to update a document and return the updated document
   *  @param {FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>} userRef
   *  @param {object} updateData
   *  @returns {Promise<FirebaseFirestore.DocumentData>} updatedDocument
   */
  async update(userRef, updateData) {
    try {
      await this.db.runTransaction(async (t) => {
        await t.update(userRef, { ...updateData });
      });

      return (await userRef.get()).data();
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }
}

Container.set('fireDb', fireDb);
Container.set(UserRepo, new UserRepo(Container));
