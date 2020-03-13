import jwt from 'jsonwebtoken';
import { config } from '../../config';

/**
 * @typedef {{
 *  id: string, firstName: string, email: string,
 *  phone: string
 * }} UserData
 *
 */

/**
 * @description Method to generate a token
 * @param {UserData} Data data used to generate the token
 *
 * @returns {string} Returns the generated token
 */
export const generateAuthToken = ({ id, email, firstName, phone }) => jwt.sign(
  {
    id,
    email,
    firstName,
    phone,
  },
  config.JWT_SECRET,
  {
    expiresIn: '1d',
  },
);
