// eslint-disable-next-line no-unused-vars
import * as Express from 'express';
// eslint-disable-next-line no-unused-vars
import * as Joi from '@hapi/joi';
import { AppResponse } from './AppResponse';
import { formatJoiErrors } from './formatJoiErrors';

/**
 * This function helps to validate a route schema
 *
 * @param {Joi.ObjectSchema} schema
 * @param {'body' | 'query' | 'params'} path - The path on the request to validate, can be
 * either of [body, query, params]
 * @returns {Express.RequestHandler<any, any, any>} Request Handler
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
