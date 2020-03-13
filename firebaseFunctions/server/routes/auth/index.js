import express from 'express';
import { AuthController } from '../../modules/auth/auth.controller';
import { asyncHandler } from '../../helpers/asyncHandler';
import { validateRouteSchema } from '../../helpers/validateRouteSchema';
import { AuthSchema } from './AuthSchema';

const authRouter = express.Router();

/**
 * signup user
 */
authRouter.post('/', validateRouteSchema(AuthSchema.signup, 'body'), asyncHandler(AuthController.attemptSignup));

export default authRouter;
