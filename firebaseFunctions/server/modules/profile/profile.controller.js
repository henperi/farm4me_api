// eslint-disable-next-line no-unused-vars
import * as Express from 'express';
import Busboy from 'busboy';

import os from 'os';
import fs from 'fs';
import path from 'path';

import { ProfileService } from './profile.service';

import { AppResponse } from '../../helpers/AppResponse';

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
    const busboy = new Busboy({ headers: req.headers });
    const tmpdir = os.tmpdir();

    // This object will accumulate all the fields, keyed by their name
    const fields = {};

    // This object will accumulate all the uploaded files, keyed by their name.
    const uploads = {};

    // This code will process each non-file field in the form.
    busboy.on('field', (fieldname, val) => {
      // TODO(developer): Process submitted field values here
      console.log(`Processed field ${fieldname}: ${val}.`);
      fields[fieldname] = val;
    });

    const fileWrites = [];

    // This code will process each file uploaded.
    busboy.on('file', (fieldname, file, filename) => {
      // Note: os.tmpdir() points to an in-memory file system on GCF
      // Thus, any files in it must fit in the instance's memory.
      const filepath = path.join(tmpdir, filename);
      uploads[fieldname] = filepath;

      console.log(`Processed file: ${filename}`);
      console.log('path', filepath);

      // const writeStream = fs.createWriteStream(filepath);
      // file.pipe(writeStream);

      // File was processed by Busboy; wait for it to be written.
      // Note: GCF may not persist saved files across invocations.
      // Persistent files must be kept in other locations
      // (such as Cloud Storage buckets).
      // const promise = new Promise((resolve, reject) => {
      //   file.on('end', () => {
      //     // writeStream.end();
      //   });
      //   // writeStream.on('finish', resolve);
      //   // writeStream.on('error', reject);
      // });
      // fileWrites.push(promise);
    });

    busboy.on('finish', async () => {
      await Promise.all(fileWrites);

      // TODO(developer): Process saved files here
      for (const file in uploads) {
        fs.unlinkSync(uploads[file]);
      }
      res.send();
    });

    if (req.rawBody) {
      busboy.end(req.rawBody);
    } else { req.pipe(busboy); }


    return AppResponse.success(res);
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
