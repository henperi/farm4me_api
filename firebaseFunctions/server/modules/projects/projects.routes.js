import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import { validateRouteSchema } from '../../helpers/validateRouteSchema';
import { ProjectSchema } from './projects.routeSchema';
import { ProjectsController } from './projects.controller';
import { Authorize } from '../../middlewares/Authorize';

const projectRouter = express.Router();

/**
 * Create a new project
 */
projectRouter.post(
  '/',
  Authorize.user,
  validateRouteSchema(ProjectSchema.create, 'body'),
  asyncHandler(ProjectsController.create),
);

/**
 * Get all projects of the authunticated user
 */
projectRouter.get(
  '/',
  Authorize.user,
  asyncHandler(ProjectsController.getAll),
);

/**
 * Start a project
 */
projectRouter.post(
  '/start/:transactionRef',
  Authorize.user,
  validateRouteSchema(ProjectSchema.start, 'params'),
  asyncHandler(ProjectsController.start),
);

export default projectRouter;
