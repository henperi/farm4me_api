import express from 'express';

import authRouter from '../modules/auth/auth.route';
import projectRouter from '../modules/projects/projects.routes';
import profileRouter from '../modules/profile/profile.route';
import userStatsRouter from '../modules/userStats/userStats.route';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/project', projectRouter);
router.use('/profile', profileRouter);
router.use('/user-stats', userStatsRouter);

export default router;
