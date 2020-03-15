import express from 'express';
import { errorRouter } from './error';
import { authRouter } from './auth';
import { userRouter } from './user';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/error', errorRouter);
router.use('/users', userRouter);

export { router as viewsRouter };
