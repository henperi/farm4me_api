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
      password: Joi.string().required(),
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
      password: Joi.string().required(),
    });
  }

  /**
   * @description The schema used to validate the process of authenticating a user
   */
  static get fcmTokenSchema() {
    return Joi.object({
      fcmToken: Joi.string().required(),
    });
  }

  /**
   * @description The schema used to validate the process of authenticating a user
   */
  static get resetPasswordSchema() {
    return {
      payload: Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
      }),
      params: Joi.object({
        resetId: Joi.string()
          .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
          .error(
            new Error('The reset key supplied has an invalid format'),
          ),
      }),
    };
  }
}
