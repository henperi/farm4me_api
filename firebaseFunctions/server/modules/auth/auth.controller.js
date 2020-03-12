// eslint-disable-next-line no-unused-vars
import * as Express from 'express';
import { AuthService } from './auth.service';
import { AppResponse } from '../../helpers/AppResponse';

/**
 * User Controller Class
 */
export class AuthController {
  /**
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   *
   * @returns {Promise<any>} response
   */
  static async attemptSignup(req, res) {
    const { email, phone, password } = req.body;

    const isEmailTaken = await AuthService.checkEmailExists(email);

    if (isEmailTaken) {
      return AppResponse.badRequest(res, { message: 'An account already exist with this details' });
    }

    const user = await AuthService.signupUser({ email, phone, password });

    return AppResponse.success(res, { data: user });
  }
}
