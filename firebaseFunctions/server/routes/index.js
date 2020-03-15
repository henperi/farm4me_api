import express from 'express';

import authRouter from '../modules/auth/auth.route';
import projectRouter from '../modules/projects/projects.routes';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/project', projectRouter);

export default router;
