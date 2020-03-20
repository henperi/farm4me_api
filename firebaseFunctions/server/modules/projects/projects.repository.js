import { log } from 'util';
import { Container } from 'typedi';

import { collections } from '../../models';

/**
 * @typedef {typeof Container} DiContainer
 */

/**
 * @typedef {{
 *   ownerId: string,
 *   name: string,
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

  /**
   *  Method to get a Project by id
   *  @param {string} id
   *  @returns {Promise<FirebaseFirestore.DocumentSnapshot>} projectDocSnapshot
   */
  async getById(id) {
    try {
      const projectDocSnapshot = await this.Project.doc(`/${id}`).get();

      return projectDocSnapshot;
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }

  /**
   *  Method to get a Project by reference
   *  @param {string} reference
   *  @returns {Promise<FirebaseFirestore.QuerySnapshot>} projectDocSnapshot
   */
  async getByReference(reference) {
    try {
      return await this.Project.where('reference', '==', reference).limit(1).get();
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }

  /**
   *  Method to get all Projects by the ownerId
   *  @param {string} ownerId
   *  @returns {Promise<FirebaseFirestore.DocumentData[] | null>} projectDocSnapshot
   */
  async getByOwnerId(ownerId) {
    try {
      const querySnapshot = await this.Project.where(
        'ownerId',
        '==',
        ownerId,
      ).orderBy('createdAt', 'desc').get();

      if (querySnapshot.empty) {
        return [];
      }
      return querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        docData.id = doc.id;
        return docData;
      });
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }

  /**
   *  Runs a Transaction to update a document and return the updated document
   *  @param {FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>} projectRef
   *  @param {{ isPaid: boolean, startDate: number, endDate: number}} updateData
   *  @returns {Promise<FirebaseFirestore.DocumentData>} updatedDocument
   */
  async update(projectRef, updateData) {
    try {
      await this.db.runTransaction(async (t) => {
        await t.update(projectRef, { ...updateData });
      });

      return (await projectRef.get()).data();
    } catch (error) {
      log(error);
      throw new Error(error);
    }
  }
}

Container.set(ProjectsRepo, new ProjectsRepo(Container));
