import { log } from 'util';
import { AppResponse } from './AppResponse';
/**
 *
 * @typedef {{
 *  (req, res, next): any
 * }} MiddlwareFunction
 */


/**
  *
  * @param {MiddlwareFunction} callbackMiddleware
  * @returns {*} any
  */
export const asyncHandler = (callbackMiddleware) => async (req, res, next) => {
  try {
    return await callbackMiddleware(req, res, next);
  } catch (errors) {
    log(errors);

    return AppResponse.serverError(res, { errors });
  }
};
