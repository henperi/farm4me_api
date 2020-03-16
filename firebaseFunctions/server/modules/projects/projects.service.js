import { Container } from 'typedi';
import paystackModule from 'paystack';
import { log } from 'util';

import { ProjectsRepo } from './projects.repository';
import { config } from '../../../config';


const paystack = paystackModule(config.PAYSTACK.SECRET);

const availableInvestment = {
  '1a2wQrd': {
    id: '1a2wQrd',
    name: 'Maize Project',
    costPerHectre: 227000,
    percentageProfit: 20,
    duration: 6,
    season: 'Dry and Wet',
    insurance: 'Leadway Insurance',
    refundPercent: '100%',
  },
  '3a2wQrd': {
    id: '3a2wQrd',
    name: 'Millet',
    costPerHectre: 227000,
    percentageProfit: 20,
    duration: 6,
    season: 'Dry and Wet',
    insurance: 'Leadway Insurance',
    refundPercent: '100%',
  },
  '2a2wQrd': {
    id: '2a2wQrd',
    name: 'Sesam',
    costPerHectre: 227000,
    percentageProfit: 20,
    duration: 6,
    season: 'Dry and Wet',
    insurance: 'Leadway Insurance',
    refundPercent: '100%',
  },
  '4a2wQrd': {
    id: '4a2wQrd',
    name: 'Mellon',
    costPerHectre: 227000,
    percentageProfit: 20,
    duration: 6,
    season: 'Dry and Wet',
    insurance: 'Leadway Insurance',
    refundPercent: '100%',
  },
};

/**
 *
 * @typedef {{
 *    investmentId: string, numberOfHecters: string, ownerId: string
 *  }} Project.create
 */

/**
 * @typedef {Promise<{
 *     projectSnapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> | null,
 *     belongsToUser: boolean
 *     }
 *  >} isValidUserProject
 */

/**
 * User Service class
 */
export class ProjectsService {
  /**
   *  Method to check if an investmentId is valid
   *  @param {string} investmentId
   *
   *  @returns {Promise<boolean>} the status of an existing email
   */
  static async checkInvestmentId(investmentId) {
    const investment = availableInvestment[investmentId];

    if (!investment) {
      return false;
    }

    return true;
  }

  /**
   *  Method to check if a user has unpaid projects
   *  @param {string} userId
   *
   *  @returns {Promise<boolean>} the status of an existing email
   */
  static async checkUnpaidProjects(userId) {
    const projectsRepo = Container.get(ProjectsRepo);
    const docSnapShot = await projectsRepo.getUnpaidProjects(userId);

    if (docSnapShot.empty) {
      return false;
    }

    return true;
  }

  /**
   * Method to create a newProject
   *  @param {Project.create} userData
   *
   *  @returns {Promise<FirebaseFirestore.DocumentData>} user
   */
  static async create({ investmentId, numberOfHecters, ownerId }) {
    const projectRepo = Container.get(ProjectsRepo);
    /**
     * @type {typeof availableInvestment[123]}
     */
    const investmentData = availableInvestment[investmentId];
    const totalCost = investmentData.costPerHectre * parseInt(numberOfHecters, 10);
    const totalReturns = totalCost * (1 + investmentData.percentageProfit / 100);
    const profit = totalReturns - totalCost;

    const project = {
      ...investmentData,
      ownerId,
      numberOfHecters: parseInt(numberOfHecters, 10),
      totalCost,
      totalReturns,
      profit,
      isPaid: false,
      name: investmentData.name,
      duration: investmentData.duration,
      createdAt: Date.now(),
      startDate: null,
      endDate: null,
    };

    const projectRef = await projectRepo.create(project);
    const projectDoc = (await projectRef.get()).data();
    projectDoc.id = projectRef.id;

    return { project: projectDoc };
  }

  /**
   * Method to get a user's projects
   *  @param {{userId: string}} userData
   *
   *  @returns {Promise<FirebaseFirestore.DocumentData>} user
   */
  static async getUserProjects({ userId }) {
    const projectRepo = Container.get(ProjectsRepo);

    const projects = await projectRepo.getByOwnerId(userId);

    return { projects };
  }

  /**
   * Method to validate a transaction
   * @param {string} transactionRef
   *
   * @returns {Promise<{status: boolean, data: any}>} validateTransaction
   */
  static async validateTransaction(transactionRef) {
    const response = await paystack.transaction.verify(transactionRef);

    log(`response::=> ${response}`);

    if (response.status) {
      if (response.data.status) {
        return { status: true, data: response.data };
      }
      return { status: false, data: null };
    }

    return { status: false, data: null };
  }

  /**
   * Method to get a user's projects
   *  @param {{ ownerId: string, projectId: string }} userData
   *
   * @returns {isValidUserProject} whether the project is valid or not
   *
   */
  static async isValidUserProject({ ownerId, projectId }) {
    const projectRepo = Container.get(ProjectsRepo);

    const projectSnapshot = await projectRepo.getById(projectId);

    if (
      projectSnapshot.exists
      && projectSnapshot.data().ownerId === ownerId
    ) {
      return { projectSnapshot, belongsToUser: true };
    }

    return { projectSnapshot: null, belongsToUser: false };
  }

  /**
   * Method to get a user's projects
   *
   * @param {FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>} projectRef
   * @returns {Promise<{updatedProject: FirebaseFirestore.DocumentData}>} updatedProject
   */
  static async start(projectRef) {
    const projectRepo = Container.get(ProjectsRepo);

    const oneMonthInMilliSeconds = 60 * 60 * 24 * 30 * 1000;

    const endDate = (await projectRef.get()).data().duration * oneMonthInMilliSeconds;

    const updatedProject = await projectRepo.update(projectRef, {
      isPaid: true,
      startDate: Date.now(),
      endDate: Date.now() + endDate,
    });

    updatedProject.id = projectRef.id;

    return { updatedProject };
  }
}
