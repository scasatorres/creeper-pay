import { Request, Response } from 'express';
import express from 'express';
import { errorRouter } from './error';
import { authRouter } from './auth';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/error', errorRouter);

export { router as viewsRouter };
