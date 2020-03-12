import express from 'express';
import { AuthController } from '../../modules/auth/auth.controller';
import { asyncHandler } from '../../helpers/asyncHandler';

const authRouter = express.Router();

/**
 * signup user
 */
authRouter.post('/', asyncHandler(AuthController.attemptSignup));

export default authRouter;
