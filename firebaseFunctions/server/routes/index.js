import express from 'express';

import authRouter from '../modules/auth/auth.route';
import projectRouter from '../modules/projects/projects.routes';
import profileRouter from '../modules/profile/profile.route';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/project', projectRouter);
router.use('/profile', profileRouter);

export default router;
