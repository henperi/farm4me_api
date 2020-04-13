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
    const { firstName, email, phone, password } = req.body;

    const isEmailTaken = await AuthService.checkEmailExists(email);
    const isPhoneTaken = await AuthService.checkPhoneExists(phone);

    if (isEmailTaken) {
      return AppResponse.badRequest(res, { message: 'This email is already registered on our database. Perhaps you should try to login if this email account is yours' });
    }

    if (isPhoneTaken) {
      return AppResponse.badRequest(res, { message: 'This exact phone number is already registered on our database.' });
    }

    const { token } = await AuthService.signupUser({ email, phone, password, firstName });

    return AppResponse.success(res, { data: { token } });
  }

  /**
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   *
   * @returns {Promise<any>} response
   */
  static async attemptLogin(req, res) {
    const { email, password } = req.body;
    const { isValidUser, token } = await AuthService.attemptAuth(email, password);

    if (!isValidUser) {
      return AppResponse.unAuthorized(res, { message: 'Invalid login credential' });
    }

    return AppResponse.success(res, { data: { token } });
  }
}
