import Joi from '@hapi/joi';

/**
 * Schemas for all the endpoints relating to profile
 */
export class ProfileSchema {
  /**
   * @description The schema used to validate the profile/addPersonalInfo endpoint
   */
  static get addPersonalInfo() {
    return Joi.object({
      firstName: Joi.string()
        .min(3)
        .max(40)
        .required(),
      lastName: Joi.string()
        .min(3)
        .max(40)
        .required(),
      phone: Joi.string()
        .length(11)
        .required(),
    });
  }

  /**
   * @description The schema used to validate the profile/addBankInfo endpoint
   */
  static get addBankInfo() {
    return Joi.object({
      accountName: Joi.string()
        .min(3)
        .max(40)
        .required(),
      accountNumber: Joi.string()
        .min(3)
        .max(40)
        .required(),
      bankName: Joi.string()
        .min(3)
        .max(40)
        .required(),
    });
  }

  /**
   * @description The schema used to validate the profile/addAddressInfo endpoint
   */
  static get addAddressInfo() {
    return Joi.object({
      city: Joi.string()
        .min(3)
        .max(40)
        .required(),
      state: Joi.string()
        .min(3)
        .max(40)
        .required(),
      addressLine1: Joi.string()
        .min(3)
        .max(50)
        .required(),
    });
  }
}
