// eslint-disable-next-line no-unused-vars
import * as Express from 'express';
import { UserStatsService } from './userStats.service';
import { AppResponse } from '../../helpers/AppResponse';
/**
 * User Stats Controller Class
 */
export class UserStatsController {
  /**
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   *
   * @returns {Promise<any>} response
   */
  static async get(req, res) {
    const { id } = res.locals.AuthUser;
    const userStats = await UserStatsService.getUserStats(id);

    return AppResponse.success(res, { data: { userStats } });
  }
}
