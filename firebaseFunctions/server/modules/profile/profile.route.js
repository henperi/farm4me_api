import express from 'express';

import { asyncHandler } from '../../helpers/asyncHandler';
import { validateRouteSchema } from '../../helpers/validateRouteSchema';
import { ProfileSchema } from './profile.routeSchema';
import { ProfileController } from './profile.controller';
import { Authorize } from '../../middlewares/Authorize';

const profileRouter = express.Router();

/**
 * add/update personal info
 */
profileRouter.put(
  '/update-personal-data',
  Authorize.user,
  validateRouteSchema(ProfileSchema.addPersonalInfo, 'body'),
  asyncHandler(ProfileController.addPersonalInfo),
);

/**
 * add bank info
 */
profileRouter.post(
  '/add-bank',
  Authorize.user,
  validateRouteSchema(ProfileSchema.addBankInfo, 'body'),
  asyncHandler(ProfileController.addBankInfo),
);

/**
 * add address info
 */
profileRouter.post(
  '/add-address',
  Authorize.user,
  validateRouteSchema(ProfileSchema.addAddressInfo, 'body'),
  asyncHandler(ProfileController.addAddressInfo),
);

/**
 * add/update bank info
 */
profileRouter.get(
  '/',
  Authorize.user,
  asyncHandler(ProfileController.get),
);

export default profileRouter;
