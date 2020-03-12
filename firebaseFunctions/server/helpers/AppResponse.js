/* eslint-disable require-jsdoc */

/**
 *
 */
class AppResponse {
  /**
   * @description Success Method
   * @param {*} res
   * @param {Object} [Response] - The success response object.
   * @param {string=} Response.message - The message.
   * @param {number=} Response.statusCode - The status code.
   * @param {Object<string, any> | Array} [Response.data] - The data.
   *
   * @returns {*} Return
   */
  static success(
    res,
    { message = 'Request Successful', statusCode = 200, data = {} } = {},
  ) {
    res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
    });
  }

  /**
   * @description Create Method
   * @param {*} res
   * @param {Object} [Response] - The success response object.
   * @param {string=} Response.message - The message.
   * @param {number=} Response.statusCode - The status code.
   * @param {Object<string, any> | Array} [Response.data] - The data.
   *
   * @returns {*} Returns
   */
  static created(
    res,
    { message = 'Created Successfully', statusCode = 201, data = {} } = {},
  ) {
    res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
    });
  }

  /**
   * @description NotFound Method
   * @param {*} res
   * @param {Object} [Response] - The success response object.
   * @param {string=} Response.message - The message.
   * @param {number=} Response.statusCode - The status code.
   * @param {Object<string, any> | Array} [Response.errors] - The data.
   *
   * @returns {*} Return
   */
  static badRequest(
    res,
    { message = 'Bad Request', statusCode = 400, errors = {} } = {},
  ) {
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
    });
  }

  /**
   * @description unAuthorized Method
   * @param {*} res
   * @param {Object} [Response] - The success response object.
   * @param {string=} Response.message - The message.
   * @param {number=} Response.statusCode - The status code.
   * @param {Object<string, any> | Array} [Response.errors] - The data.
   *
   * @returns {*} Return
   */
  static unAuthorized(
    res,
    {
      message = 'unAuthorized Request',
      statusCode = 401,
      errors = {},
    } = {},
  ) {
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
    });
  }

  /**
   * @description NotFound Method
   * @param {*} res
   * @param {Object} [Response] - The success response object.
   * @param {string=} Response.message - The message.
   * @param {number=} Response.statusCode - The status code.
   * @param {Object<string, any> | Array} [Response.errors] - The data.
   *
   * @returns {*} Return
   */
  static notFound(
    res,
    { message = 'Resource not found', statusCode = 404, errors = {} } = {},
  ) {
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
    });
  }

  /**
   * @description NotFound Method
   * @param {*} res
   * @param {Object} [Response] - The success response object.
   * @param {string=} Response.message - The message.
   * @param {number=} Response.statusCode - The status code.
   * @param {Object<string, any> | Array} [Response.errors] - The data.
   *
   * @returns {*} Return
   */
  static forbidden(
    res,
    { message = 'Request Forbidden', statusCode = 403, errors = {} } = {},
  ) {
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
    });
  }

  /**
   * @description NotFound Method
   * @param {*} res
   * @param {Object} [Response] - The success response object.
   * @param {string=} Response.message - The message.
   * @param {number=} Response.statusCode - The status code.
   * @param {Object<string, any> | Array} [Response.errors] - The data.
   *
   * @returns {*} Return
   */
  static conflict(
    res,
    {
      message = 'Conflicting Request',
      statusCode = 409,
      errors = {},
    } = {},
  ) {
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
    });
  }

  /**
   * @description NotFound Method
   * @param {*} res
   * @param {Object} [Response] - The success response object.
   * @param {string=} Response.message - The message.
   * @param {number=} Response.statusCode - The status code.
   * @param {Object<string, any> | Array} [Response.errors] - The data.
   *
   * @returns {*} Return
   */
  static serverError(
    res,
    {
      message = 'An internal error occured',
      statusCode = 500,
      errors = {},
    } = {},
  ) {
    const getErrors = () => {
      if (process.env.NODE_ENV === 'production') {
        return 'This error might be from us, send us a message at info@advertiseit.com if this continues';
      }
      return errors.toString();
    };
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors: getErrors(),
    });
  }
}

const setAppResponse = (req, res, next) => {
  /**
   * @type {AppResponse}
   */
  res.locals.AppResponse = AppResponse;

  return next();
};

export { AppResponse, setAppResponse };
