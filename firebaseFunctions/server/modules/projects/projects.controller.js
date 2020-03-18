// eslint-disable-next-line no-unused-vars
import * as Express from 'express';
import { ProjectsService } from './projects.service';
import { AppResponse } from '../../helpers/AppResponse';
import { toKobo } from '../../helpers/toKobo';
/**
 * Projects Controller Class
 */
export class ProjectsController {
  /**
   * Create project
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   *
   * @returns {Promise<any>} response
   */
  static async create(req, res) {
    const { investmentId, numberOfHecters } = req.body;
    const { id } = res.locals.AuthUser;

    const [hasUnpaidProjects, isValidInvestment] = await Promise.all([
      ProjectsService.checkUnpaidProjects(id),
      ProjectsService.checkInvestmentId(investmentId),
    ]);

    if (!isValidInvestment) {
      return AppResponse.badRequest(res, {
        message: 'Invalid Investment selected, check your investmentId',
      });
    }

    if (hasUnpaidProjects) {
      return AppResponse.badRequest(res, {
        message: 'You have unpaid projects',
      });
    }

    const project = await ProjectsService.create({
      investmentId,
      numberOfHecters,
      ownerId: id,
    });

    return AppResponse.success(res, { data: project });
  }

  /**
   * Get all projects of an authorized user
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   *
   * @returns {Promise<any>} response
   */
  static async getAll(req, res) {
    const { id } = res.locals.AuthUser;

    const projects = await ProjectsService.getUserProjects({
      userId: id,
    });

    return AppResponse.success(res, { data: projects });
  }

  /**
   * Get all projects of an authorized user
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   *
   * @returns {Promise<any>} response
   */
  static async start(req, res) {
    const { transactionRef } = req.params;

    const {
      isValidProject,
      project,
    } = await ProjectsService.validateByReference({
      reference: transactionRef,
    });

    const { status, data } = await ProjectsService.validateTransaction(
      transactionRef,
    );

    if (!status) {
      return AppResponse.badRequest(res, {
        message: 'Invalid Transaction',
      });
    }

    if (!isValidProject) {
      return AppResponse.badRequest(res, {
        message: 'Invalid project',
      });
    }

    if (data.amount !== toKobo(project.data().totalCost)) {
      return AppResponse.badRequest(res, {
        message: 'Project Amount does not match',
      });
    }

    if (project.data().isPaid) {
      return AppResponse.badRequest(res, {
        message: 'This Project has been started previously',
      });
    }

    const updatedProject = await ProjectsService.start(
      project.ref,
    );

    return AppResponse.success(res, { data: updatedProject });
  }
}
