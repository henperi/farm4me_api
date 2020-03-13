import { Container } from 'typedi';
import { UserRepo } from './user.repository';
import { generateAuthToken } from '../../helpers/tokenHelpers';

/**
 * User Service class
 */
export class AuthService {
  /**
   * Service method to signup a user
   *  @param {any} userData
   *
   *  @returns {Promise<FirebaseFirestore.DocumentData>} user
   */
  static async signupUser(userData) {
    const userRepo = Container.get(UserRepo);
    const user = await userRepo.create(userData);
    const userDoc = (await user.get()).data();

    const { password, ...userWithoutPassword } = userDoc;
    userWithoutPassword.id = user.id;

    /**
     * @type {*}
     */
    const result = { ...userWithoutPassword };
    const token = generateAuthToken(result);

    return { user: { ...result, token } };
  }

  /**
   *  Method to check if an email has been taken or not
   *  @param {string} email
   *
   *  @returns {Promise<boolean>} the status of an existing email
   */
  static async checkEmailExists(email) {
    const userRepo = Container.get(UserRepo);
    const userSnapShot = await userRepo.getByEmail(email);

    if (userSnapShot.empty) {
      return false;
    }

    /*
    const result = [];
    userSnapShot.forEach((docs) => result.push(docs.data()));
    */

    return true;
  }
}
