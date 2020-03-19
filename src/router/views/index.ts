import express from 'express';
import { errorRouter } from './error';
import { authRouter } from './auth';
import { userRouter } from './user';
import { paymentRouter } from './payment';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/error', errorRouter);
router.use('/users', userRouter);
router.use('/payment', paymentRouter);

export { router as viewsRouter };
