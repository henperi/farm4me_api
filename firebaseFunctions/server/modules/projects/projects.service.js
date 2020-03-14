import { Container } from 'typedi';
import { ProjectsRepo } from './projects.repository';

const availableInvestment = {
  123: {
    price: 0,
    profit: 0,
    duration: 0,
    season: 0,
    name: 'a',
  },
};

/**
 * User Service class
 */
export class ProjectsService {
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
   *  @param {{investmentId: string, numberOfHecters: number, ownerId: string}} userData
   *
   *  @returns {Promise<FirebaseFirestore.DocumentData>} user
   */
  static async create({ investmentId, numberOfHecters, ownerId }) {
    const projectRepo = Container.get(ProjectsRepo);
    /**
     * @type {typeof availableInvestment.id}
     */
    const investmentData = availableInvestment[investmentId];

    const project = {
      ownerId,
      projectName: investmentData.name,
      totalCost: investmentData.price * numberOfHecters,
      numberOfHecters,
      isPaid: false,
      profit: investmentData.profit,
      totalReturns:
        investmentData.price * numberOfHecters + investmentData.profit,
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
