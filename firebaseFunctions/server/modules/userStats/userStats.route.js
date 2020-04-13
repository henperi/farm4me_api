import express from 'express';

import { asyncHandler } from '../../helpers/asyncHandler';
import { Authorize } from '../../middlewares/Authorize';
import { UserStatsController } from './userStats.controller';

const userStatsRouter = express.Router();


/**
 * Get user stats
 */
userStatsRouter.get(
  '/',
  Authorize.user,
  asyncHandler(UserStatsController.get),
);

export default userStatsRouter;
