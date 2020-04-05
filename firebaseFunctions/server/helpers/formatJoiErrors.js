/**
 * @typedef {{ message: string, path: string }} Detail
 */
/**
 * @typedef {{ details: Detail[] }} Errors
 */
/**
 * @typedef {{ details: Detail[] | string, detailsObject: {} }} FormatedError
 */

/**
 *
 * @param {Errors} errors
 * @returns {FormatedError} error
 */
export const formatJoiErrors = (errors) => {
  const { details } = errors;
  const detailsArray = [];
  const detailsObject = {};

  if (details) {
    details.map((detail) => {
      const { message, path } = detail;
      detailsObject[path[0]] = message.replace(/"/gi, '');

      return detailsArray.push({
        message: message.replace(/"/gi, ''),
        path: path[0],
      });
    });

    return { details: detailsArray, detailsObject };
  }

  return { details: errors.toString(), detailsObject };
};
