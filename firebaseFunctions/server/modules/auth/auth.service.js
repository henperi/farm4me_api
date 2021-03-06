import { Container } from 'typedi';
import { UserRepo } from '../user/user.repository';
import { generateAuthToken } from '../../helpers/tokenHelpers';
import { comparePassword } from '../../helpers/passwordHelpers';
import { ProfileService } from '../profile/profile.service';
import { UserStatsService } from '../userStats/userStats.service';

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
    const userRef = await userRepo.create(userData);
    const userDoc = (await userRef.get()).data();

    ProfileService.createProfile(userRef.id);
    UserStatsService.createUserStats(userRef.id);

    const { password, ...userWithoutPassword } = userDoc;
    userWithoutPassword.id = userRef.id;

    /**
     * @type {*}
     */
    const result = { ...userWithoutPassword };
    const token = generateAuthToken(result);

    return { user: userWithoutPassword, token };
  }

  /**
   *  Method to check if an email has been taken or not
   *  @param {string} email
   *
   *  @returns {Promise<boolean>} the status of an existing email
   */
  static async checkEmailExists(email) {
    const userRepo = Container.get(UserRepo);
    const docSnapShot = await userRepo.getByEmail(email);

    if (docSnapShot.empty) {
      return false;
    }

    return true;
  }

  /**
   *  Method to check if an email has been taken or not
   *  @param {string} phone
   *
   *  @returns {Promise<boolean>} the status of an existing phone
   */
  static async checkPhoneExists(phone) {
    const userRepo = Container.get(UserRepo);
    const docSnapShot = await userRepo.getByPhone(phone);

    if (docSnapShot.empty) {
      return false;
    }

    return true;
  }

  /**
   *  Method to check if an email has been taken or not
   *  @param {string} email
   *  @param {string} password
   *
   *  @returns {Promise<{isValidUser: boolean, token: string}>} the status of an existing email
   */
  static async attemptAuth(email, password) {
    const userRepo = Container.get(UserRepo);
    const querySnapShot = await userRepo.getByEmail(email);

    if (querySnapShot.empty) {
      return { isValidUser: false, token: null };
    }

    const userSnapShot = querySnapShot.docs.map((doc) => doc)[0];

    if (!comparePassword(password, userSnapShot.data().password)) {
      return { isValidUser: false, token: null };
    }

    const {
      password: userPassword,
      ...userWithoutPassword
    } = userSnapShot.data();

    userWithoutPassword.id = userSnapShot.id;

    /**
     * @type {*}
     */
    const result = { ...userWithoutPassword };
    const token = generateAuthToken(result);

    return { isValidUser: true, token };
  }
}
