import { Container } from 'typedi';
import { firestore } from 'firebase-admin';
import { UserRepo } from '../user/user.repository';
import { ProfileRepo } from './profile.repository';

/**
 * User Service class
 */
export class ProfileService {
  /**
   *  Service method to update a user's personal info
   *  @param {FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>} userRef
   *  @param {{
   *   firstName: string,
   *   lastName: string,
   *   phone: string,
   *   address: string,
   *  }} personalInfoData
   *
   *  @returns {Promise<FirebaseFirestore.DocumentData>} user
   */
  static async addPersonalInfo(userRef, personalInfoData) {
    const userRepo = Container.get(UserRepo);

    return userRepo.update(userRef, personalInfoData);
  }

  /**
   *  Service method to update a user's personal info
   *  @param {string} userId
   *  @param {{
   *   bankName: string,
   *   accountNumber: string,
   *   accountName: string,
   *  }} bankData
   *
   *  @returns {Promise<{
        * previouslyAdded: boolean,
        * profile: FirebaseFirestore.DocumentData
   *  }>} profile
   */
  static async addBankInfo(userId, bankData) {
    const profileRepo = Container.get(ProfileRepo);

    const profileRef = await profileRepo.getRefById(userId);

    const data = (await profileRef.get()).data().bank;

    if (data) {
      return { previouslyAdded: true, profile: null };
    }

    const profile = await profileRepo.update(profileRef, {
      bank: bankData,
      percentageComplete: firestore.FieldValue.increment(25),
    });

    return { previouslyAdded: false, profile };
  }

  /**
   *  Service method to update a user's address info
   *  @param {string} userId
   *  @param {{
   *   city: string,
   *   state: string,
   *   addressLine1: string,
   *  }} addressData
   *
   *  @returns {Promise<{
        * previouslyAdded: boolean,
        * profile: FirebaseFirestore.DocumentData
   *  }>} profile
   */
  static async addAddressInfo(userId, addressData) {
    const profileRepo = Container.get(ProfileRepo);

    const profileRef = await profileRepo.getRefById(userId);

    const data = (await profileRef.get()).data().address;

    if (data) {
      return { previouslyAdded: true, profile: null };
    }

    const profile = await profileRepo.update(profileRef, {
      address: addressData,
      percentageComplete: firestore.FieldValue.increment(25),
    });

    return { previouslyAdded: false, profile };
  }

  /**
  *  Service method to update a user's docs info
  *  @param {string} userId
  *  @param {{
  *   profileImage: string,
  *   validIdCard: string,
  *  }} docsData
  *
  *  @returns {Promise<FirebaseFirestore.DocumentData>} user
  */
  static async addDocsInfo(userId, docsData) {
    const profileRepo = Container.get(ProfileRepo);

    const profileRef = await profileRepo.getRefById(userId);

    return profileRepo.update(profileRef, {
      docs: docsData,
    });
  }

  /**
  *  Service method to get a user's profile
  *  @param {string} userId
  *
  *  @returns {Promise<FirebaseFirestore.DocumentData>} user
  */
  static async getProfile(userId) {
    const profileRepo = Container.get(ProfileRepo);

    const profileRef = await profileRepo.getRefById(userId);

    if (!await (await profileRef.get()).exists) {
      await this.createProfile(userId);
    }

    return (await profileRef.get()).data();
  }

  /**
  *  Service method to create a user's profile
  *  @param {string} userId
  *
  *  @returns {Promise<void>} profile
  */
  static async createProfile(userId) {
    const profileRepo = Container.get(ProfileRepo);

    await profileRepo.create(userId);
  }
}
