// eslint-disable-next-line no-unused-vars
import * as Express from 'express';
import * as jwt from 'jsonwebtoken';
import { Container } from 'typedi';

import { config } from '../../config';
import { AppResponse } from '../helpers/AppResponse';
import { UserRepo } from '../modules/auth/user.repository';

/**
 * The Authorization class
 */
export class Authorize {
  /**
   * Method to verify and decode a user's token
   * @param {string} token
   * @returns {object | string} Returns the decoded token
   */
  static verifyAndDecodeToken(token) {
    return jwt.verify(token, config.JWT_SECRET);
  }

  /**
   * Middleware method to authorize a user
   * If authorized the user is stored in res.locals.AuthUser for the lifecycle of the request
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Express.NextFunction} next
   * @returns {Promise<Express.NextFunction | void>} Request Handler
   */
  static async user(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
      return AppResponse.badRequest(res, {
        message: 'Authorization header absent, are you logged in?',
      });
    }

    try {
      const decodedToken = Authorize.verifyAndDecodeToken(token);
      const { email } = decodedToken;

      const userRepo = Container.get(UserRepo);
      const querySnapShot = await userRepo.getByEmail(email);

      if (querySnapShot.empty) {
        return AppResponse.notFound(res, {
          message: 'Unable to authorize you',
        });
      }

      const userSnapShot = querySnapShot.docs.map((doc) => doc)[0];

      const {
        password: userPassword,
        ...userWithoutPassword
      } = userSnapShot.data();

      userWithoutPassword.id = userSnapShot.id;
      res.locals = { ...res.locals, AuthUser: userWithoutPassword };

      return next();
    } catch (errors) {
      const errorName = errors.name;
      let message;

      if (
        errorName === 'TokenExpiredError'
        || errorName === 'JsonWebTokenError'
      ) {
        message = 'Your authorization token is either invalid or expired';

        return AppResponse.unAuthorized(res, {
          message,
        });
      }

      return AppResponse.serverError(res, { errors });
    }
  }
}
