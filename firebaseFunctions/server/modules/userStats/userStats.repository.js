import { log } from 'util';
import { Container } from 'typedi';

import { fireDb, collections } from '../../models';

/**
 * @typedef {typeof Container} DiContainer
 */

/**
 * This is the profile repository
 */
export class UserStatsRepo {
  /**
   * @param {DiContainer} container
   */
  constructor(container) {
    /**
     * @type {FirebaseFirestore.Firestore}
     */
    this.db = container.get('fireDb');
    this.UserStats = this.db.collection(collections.UserStats);
  }

  /**
   * method to get a user by email
   *  @param {string} userId
   *
   *  @returns {Promise<
   *    FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
   *  >} Profile Ref
   */
  async getRefById(userId) {
    try {
      return await (await this.UserStats.doc(userId).get()).ref;
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }

  /**
   *  method to create a user stat
   *  @param {string} userId
   *
   *  @returns {Promise<FirebaseFirestore.WriteResult>} user
   */
  async create(userId) {
    try {
      const userStatsRef = this.UserStats.doc(userId);

      return await userStatsRef.set({
        userId,
        totalProjects: 0,
        totalCashInvested: 0,
        totalCashAvailableForWithdrawal: 0,
        totalRunningProjects: 0,
      });
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }

  /**
   *  Runs a Transaction to update a document and return the updated document
   *  @param {FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>} userStatsRef
   *  @param {object} updateData
   *  @returns {Promise<FirebaseFirestore.DocumentData>} updatedDocument
   */
  async update(userStatsRef, updateData) {
    try {
      await this.db.runTransaction(async (t) => {
        await t.update(userStatsRef, { ...updateData });
      });

      return (await userStatsRef.get()).data();
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }
}

Container.set('fireDb', fireDb);
Container.set(UserStatsRepo, new UserStatsRepo(Container));
