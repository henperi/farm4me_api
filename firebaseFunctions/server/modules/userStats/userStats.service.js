import { Container } from 'typedi';
import { firestore } from 'firebase-admin';
import { UserStatsRepo } from './userStats.repository';

/**
 * User Stats Service class
 */
export class UserStatsService {
  /**
   *  Service method to increment the total number of projects of a user
   *  @param {string} userId
   *  @returns {Promise<{userStats: FirebaseFirestore.DocumentData}>} userStats
   */
  static async incrementTotalProjects(userId) {
    const userStatsRepo = Container.get(UserStatsRepo);

    const userStatsRef = await userStatsRepo.getRefById(userId);

    const userStats = await userStatsRepo.update(userStatsRef, {
      totalProjects: firestore.FieldValue.increment(1),
    });

    return { userStats };
  }

  /**
   *  Service method to increment the total number of running projects of a user
   *  @param {string} userId
   *  @returns {Promise<{userStats: FirebaseFirestore.DocumentData}>} userStats
   */
  static async incrementTotalRunningProjects(userId) {
    const userStatsRepo = Container.get(UserStatsRepo);

    const userStatsRef = await userStatsRepo.getRefById(userId);

    const userStats = await userStatsRepo.update(userStatsRef, {
      totalRunningProjects: firestore.FieldValue.increment(1),
    });

    return { userStats };
  }

  /**
   *  Service method to increment the total cash a user has invested
   *  @param {string} userId
   *  @param {number} amount
   *  @returns {Promise<{userStats: FirebaseFirestore.DocumentData}>} userStats
   */
  static async incrementTotalCashInvested(userId, amount) {
    const userStatsRepo = Container.get(UserStatsRepo);

    const userStatsRef = await userStatsRepo.getRefById(userId);

    const userStats = await userStatsRepo.update(userStatsRef, {
      totalCashInvested: firestore.FieldValue.increment(amount),
    });

    return { userStats };
  }

  /**
   *  Service method to increment the total number of projects of a user
   *  @param {string} userId
   *  @param {number} amount
   *  @returns {Promise<{userStats: FirebaseFirestore.DocumentData}>} userStats
   */
  static async incrementTotalCashAvailableForWithdrawal(userId, amount) {
    const userStatsRepo = Container.get(UserStatsRepo);

    const userStatsRef = await userStatsRepo.getRefById(userId);

    const userStats = await userStatsRepo.update(userStatsRef, {
      totalCashAvailableForWithdrawal: firestore.FieldValue.increment(amount),
    });

    return { userStats };
  }

  /**
  *  Service method to get a user's stats
  *  @param {string} userId
  *
  *  @returns {Promise<FirebaseFirestore.DocumentData>} user
  */
  static async getUserStats(userId) {
    const userStatsRepo = Container.get(UserStatsRepo);

    const userStatsRef = await userStatsRepo.getRefById(userId);

    return (await userStatsRef.get()).data();
  }

  /**
  *  Service method to create a user's profile
  *  @param {string} userId
  *
  *  @returns {Promise<void>} profile
  */
  static async createUserStats(userId) {
    const userStatsRepo = Container.get(UserStatsRepo);

    await userStatsRepo.create(userId);
  }
}
