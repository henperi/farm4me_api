// /* eslint-disable require-jsdoc */
import Joi from '@hapi/joi';

/**
 * Schemas for all the endpoints relating to auth
 */
export class AuthSchema {
  /**
   * @description The schema used to validate the auth/signup endpoint
   */
  static get signup() {
    return Joi.object({
      firstName: Joi.string()
        .min(3)
        .max(40)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(5)
        .required(),
      phone: Joi.string()
        .length(11)
        .required(),
    });
  }

  /**
   * @description The schema used to validate the process of authenticating a user
   */
  static get login() {
    return Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(5)
        .required(),
    });
  }
}
