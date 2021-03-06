// eslint-disable-next-line no-unused-vars
import * as Express from 'express';
import crypto from 'crypto';

import { ProjectsService } from './projects.service';
import { AppResponse } from '../../helpers/AppResponse';
import { toKobo } from '../../helpers/toKobo';
import { config } from '../../../config';
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
        message:
          'You have one or more unpaid projects. To create a new farming project, please delete or pay for all unpaid projects',
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
  static async getOne(req, res) {
    const { id } = res.locals.AuthUser;
    const { projectId } = req.params;

    const {
      projectSnapshot,
      belongsToUser,
    } = await ProjectsService.isValidUserProject({
      ownerId: id,
      projectId,
    });

    if (!belongsToUser) {
      return AppResponse.notFound(res, {
        message: 'This farm project was not found',
      });
    }

    return AppResponse.success(res, {
      data: {
        project: { ...projectSnapshot.data(), id: projectSnapshot.id },
      },
    });
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
      const updatedProject = {
        ...project.data(),
        id: project.id,
      };

      return AppResponse.success(res, {
        message: 'This Project has been started previously',
        data: { updatedProject },
      });
    }

    const updatedProject = await ProjectsService.start(project.ref);

    return AppResponse.success(res, { data: updatedProject });
  }

  /**
   * validate
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   *
   * @returns {Promise<any>} response
   */
  static async paystackVerifyAndStart(req, res) {
    const hash = crypto
      .createHmac('sha512', config.PAYSTACK.SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash === req.headers['x-paystack-signature']) {
      const { reference } = req.body.data;

      const {
        isValidProject,
        project,
      } = await ProjectsService.validateByReference({ reference });

      if (!isValidProject) {
        return AppResponse.badRequest(res, {
          message: 'Invalid project',
        });
      }

      if (project.data().isPaid) {
        return AppResponse.success(res, {
          message: 'This Project has been paid and has started',
        });
      }

      await ProjectsService.start(project.ref);
      return AppResponse.success(res);
    }

    return AppResponse.badRequest(res);
  }
}
