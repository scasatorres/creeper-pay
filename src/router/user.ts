import { Request } from './../models/extended-request';
import express, { NextFunction, Response } from 'express';
import admin, { auth } from 'firebase-admin';
import { User } from './../models/user';
import { db } from '../config/firebase-admin';
import { isAuthenticated } from '../middlewares/auth';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user: User = {
      username,
      email,
      password,
    };

    const userRecord = await admin.auth().createUser(user);

    res.status(200).send({ uid: userRecord.uid });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get('/me', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userRecord = await admin.auth().getUser(req.uid);

    res.status(200).send(userRecord);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.patch('/me', isAuthenticated, async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'password'];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update),
  );
  const user: User = {} as User;

  if (!isValidOperation) {
    return res.status(400).send('Error: Invalid updates!');
  }

  try {
    updates.forEach(update => (user[update] = req.body[update]));

    const userRecord = await admin.auth().updateUser(req.uid, user);

    res.status(200).send(userRecord);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/me', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userRecord = await admin.auth().deleteUser(req.uid);

    res.status(200).send(userRecord);
  } catch (error) {
    return res.status(500).send(error);
  }
});

export { router as userRouter };
