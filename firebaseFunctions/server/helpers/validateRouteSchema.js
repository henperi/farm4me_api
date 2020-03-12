// eslint-disable-next-line no-unused-vars
import * as Joi from '@hapi/joi';
import { AppResponse } from './AppResponse';
import { formatJoiErrors } from './formatJoiErrors';

/**
 * This function helps to validate a route schema
 *
 * @param {Joi.ObjectSchema} schema
 * @param {'body' | 'query' | 'params'} path - The request object path to validate
 * @returns {*} any
 */
export const validateRouteSchema = (schema, path) => async (req, res, next) => {
  try {
    await schema.validateAsync(req[path], {
      abortEarly: false,
    });

    return next();
  } catch (errors) {
    return AppResponse.badRequest(res, {
      errors: formatJoiErrors(errors),
    });
  }
};
