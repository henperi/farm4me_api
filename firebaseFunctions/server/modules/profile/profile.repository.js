import { log } from 'util';
import { Container } from 'typedi';

import { fireDb, collections } from '../../models';

/**
 * @typedef {typeof Container} DiContainer
 */

/**
 * This is the profile repository
 */
export class ProfileRepo {
  /**
   * @param {DiContainer} container
   */
  constructor(container) {
    /**
     * @type {FirebaseFirestore.Firestore}
     */
    this.db = container.get('fireDb');
    this.Profile = this.db.collection(collections.Profile);
  }

  /**
   * method to get a user by email
   *  @param {string} id
   *
   *  @returns {Promise<
   *    FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
   *  >} Profile Ref
   */
  async getRefById(id) {
    try {
      return await (await this.Profile.doc(id).get()).ref;
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }

  /**
   * method to get a user by email
   *  @param {string} userId
   *
   *  @returns {Promise<FirebaseFirestore.WriteResult>} user
   */
  async create(userId) {
    try {
      const profileRef = this.Profile.doc(userId);

      return await profileRef.set({
        userId,
      });
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }

  /**
   *  Runs a Transaction to update a document and return the updated document
   *  @param {FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>} profileRef
   *  @param {object} updateData
   *  @returns {Promise<FirebaseFirestore.DocumentData>} updatedDocument
   */
  async update(profileRef, updateData) {
    try {
      await this.db.runTransaction(async (t) => {
        await t.update(profileRef, { ...updateData });
      });

      return (await profileRef.get()).data();
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }
}

Container.set('fireDb', fireDb);
Container.set(ProfileRepo, new ProfileRepo(Container));
