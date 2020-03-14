import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import { validateRouteSchema } from '../../helpers/validateRouteSchema';
import { ProjectSchema } from './projects.routeSchema';
import { ProjectsController } from './projects.controller';
import { Authorize } from '../../middlewares/Authorize';

const projectRouter = express.Router();

/**
 * create project
 */
projectRouter.post(
  '/',
  Authorize.user,
  validateRouteSchema(ProjectSchema.create, 'body'),
  asyncHandler(ProjectsController.create),
);

export default projectRouter;
