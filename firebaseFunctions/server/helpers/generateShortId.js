import * as shortId from 'shortid';
/**
 * This method generates a random string as a reference number
 * @returns {string} random short Id
 */
export const generateShortId = () => shortId.generate();
