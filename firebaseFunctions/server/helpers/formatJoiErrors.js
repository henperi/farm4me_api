/**
 * @typedef {{ message: string, path: string }} Detail
 */
/**
 * @typedef {{ details: Detail[] }} Errors
 */
/**
 * @typedef {{ details: Detail[] | string }} FormatedError
 */

/**
 *
 * @param {Errors} errors
 * @returns {FormatedError} error
 */
export const formatJoiErrors = (errors) => {
  const { details } = errors;
  const detailsArray = [];

  if (details) {
    details.map((detail) => {
      const { message, path } = detail;

      return detailsArray.push({
        message: message.replace(/"/gi, ''),
        path: path[0],
      });
    });

    return { details: detailsArray };
  }

  return { details: errors.toString() };
};
