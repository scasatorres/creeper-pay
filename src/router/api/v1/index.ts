import express from 'express';
import { userRouter } from './user';
import { paymentRouter } from './payment';

const router = express.Router();

router.use('/users', userRouter);
router.use('/payments', paymentRouter);

export { router as v1Router };
