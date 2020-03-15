import { Container } from 'typedi';
import { ProjectsRepo } from './projects.repository';

const availableInvestment = {
  123: {
    costPerHectre: 120000,
    percentageProfit: 20,
    duration: 6,
    season: 'Dry and Wet',
    name: 'Maize Project',
  },
};

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
   *
   * @typedef {{
   *    investmentId: string, numberOfHecters: string, ownerId: string
   *  }} Project.create
   */

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
}
