import express from 'express';

import { asyncHandler } from '../../helpers/asyncHandler';
import { validateRouteSchema } from '../../helpers/validateRouteSchema';
import { AuthSchema } from './auth.routeSchema';
import { AuthController } from './auth.controller';

const authRouter = express.Router();

/**
 * signup user
 */
authRouter.post('/signup', validateRouteSchema(AuthSchema.signup, 'body'), asyncHandler(AuthController.attemptSignup));

/**
 * login user
 */
authRouter.post('/login', validateRouteSchema(AuthSchema.login, 'body'), asyncHandler(AuthController.attemptLogin));

export default authRouter;
