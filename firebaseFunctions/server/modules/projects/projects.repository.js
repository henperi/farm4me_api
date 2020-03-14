import { log } from 'util';
import { Container } from 'typedi';

import { collections } from '../../models';

/**
 * @typedef {typeof Container} DiContainer
 */

/**
 * @typedef {{
 *   ownerId: string,
 *   projectName: string,
 *   totalCost: number,
 *   numberOfHecters: number,
 *   isPaid: boolean,
 *   profit: number,
 *   totalReturns: number,
 *   duration: number,
 *   createdAt: number,
 *   startDate?: number,
 *   endDate?: number
 * }} Project
 */

/**
 * This is the user repository
 */
export class ProjectsRepo {
  /**
   * @param {DiContainer} container
   */
  constructor(container) {
    /**
     * @type {FirebaseFirestore.Firestore}
     */
    this.db = container.get('fireDb');
    this.Project = this.db.collection(collections.Project);
  }

  /**
   * method to get a users unpaid projects
   *  @param {string} ownerId
   *
   *  @returns {Promise<
   *    FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
   *  >} user unpaid projects
   */
  async getUnpaidProjects(ownerId) {
    try {
      return await this.Project.where('ownerId', '==', ownerId)
        .where('isPaid', '==', false)
        .get();
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }

  /**
   * method to get a user by email
   * @param {Project} projectData
   *
   * @returns {Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>>} user
   */
  async create(projectData) {
    try {
      return await this.Project.add({
        ...projectData,
        createdAt: Date.now(),
      });
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }
}

// Container.set('fireDb', fireDb);
Container.set(ProjectsRepo, new ProjectsRepo(Container));
