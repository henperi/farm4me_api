// eslint-disable-next-line no-unused-vars
import * as Express from 'express';
import { ProjectsService } from './projects.service';
import { AppResponse } from '../../helpers/AppResponse';
/**
 * Projects Controller Class
 */
export class ProjectsController {
  /**
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   *
   * @returns {Promise<any>} response
   */
  static async create(req, res) {
    const { investmentId, numberOfHecters } = req.body;
    const { id } = res.locals.AuthUser;

    const hasUnpaidProjects = await ProjectsService.checkUnpaidProjects(
      id,
    );

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
}
