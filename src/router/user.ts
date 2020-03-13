import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({
    message: 'hello world!',
  });
});

export { router as userRouter };
