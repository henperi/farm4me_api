// /* eslint-disable require-jsdoc */
import Joi from '@hapi/joi';

/**
 * Schemas for all the endpoints relating to project
 */
export class ProjectSchema {
  /**
   * @description The schema used to validate the {Post} /project endpoint
   */
  static get create() {
    return Joi.object({
      investmentId: Joi.string()
        .min(3)
        .max(40)
        .required(),
      numberOfHecters: Joi.number().required(),
    });
  }

  /**
   * @description The schema used to validate the {Post} /project/start/:projectId endpoint
   */
  static get start() {
    return Joi.object({
      projectId: Joi.string().required(),
      transactionRef: Joi.string().required(),
    });
  }
}
