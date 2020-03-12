import { UserRepo } from './user.repository';

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
    const user = await (await (await UserRepo.create(userData)).get()).data();
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  /**
   *  Method to check if an email has been taken or not
   *  @param {string} email
   *
   *  @returns {Promise<boolean>} the status of an existing email
   */
  static async checkEmailExists(email) {
    const userSnapShot = await UserRepo.getByEmail(email);

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
