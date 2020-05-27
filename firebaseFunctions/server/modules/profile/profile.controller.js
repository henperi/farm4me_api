// eslint-disable-next-line no-unused-vars
import * as Express from 'express';
import { ProfileService } from './profile.service';

import { AppResponse } from '../../helpers/AppResponse';
import { uploadFile } from '../../helpers/uploadFile';

/**
 * User Controller Class
 */
export class ProfileController {
  /**
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   *
   * @returns {Promise<any>} response
   */
  static async addPersonalInfo(req, res) {
    const { ref } = res.locals.AuthUser;

    const profile = await ProfileService.addPersonalInfo(ref, req.body);

    return AppResponse.success(res, { data: { profile } });
  }

  /**
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   *
   * @returns {Promise<any>} response
   */
  static async addBankInfo(req, res) {
    const { id } = res.locals.AuthUser;

    const { profile, previouslyAdded } = await ProfileService.addBankInfo(
      id,
      req.body,
    );

    if (previouslyAdded) {
      return AppResponse.conflict(res, {
        message: 'You have added your bank information previously',
      });
    }

    return AppResponse.success(res, { data: { profile } });
  }

  /**
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   *
   * @returns {Promise<any>} response
   */
  static async addAddressInfo(req, res) {
    const { id } = res.locals.AuthUser;

    const {
      profile,
      previouslyAdded,
    } = await ProfileService.addAddressInfo(id, req.body);

    if (previouslyAdded) {
      return AppResponse.conflict(res, {
        message: 'You have added your address information previously',
      });
    }

    return AppResponse.success(res, { data: { profile } });
  }

  /**
   *
   * @param {any} req
   * @param {Express.Response} res
   *
   * @returns {Promise<any>} response
   */
  static async uploadRelevantImages(req, res) {
    const { id: userId } = res.locals.AuthUser;
    const fileList = req.files;

    const uploadItems = () => fileList.map(file => uploadFile({
      file,
      userId,
      folderName: 'documents',
    }));

    /** @type {docsData} */
    const docsData = {};

    const uploadResults = await Promise.all(uploadItems());

    uploadResults.map(item => {
      const [key] = Object.keys(item);
      const [value] = Object.values(item);

      docsData[key] = value;

      return docsData;
    });

    const profile = await ProfileService.addDocsInfo(userId, docsData);

    return AppResponse.success(res, {
      data: { profile },
    });
  }

  /**
   *
   * @typedef {{
   *  email: string,
   *  id: string,
   *  ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
   * }} AuthUser
   */

  /**
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   *
   * @returns {Promise<any>} response
   */
  static async get(req, res) {
    const { id } = res.locals.AuthUser;
    const profile = await ProfileService.getProfile(id);

    return AppResponse.success(res, { data: { profile } });
  }
}
