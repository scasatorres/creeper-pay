import { paymentStatusEnum } from './../../../models/user';
import { MinecraftUUID } from './../../../models/minecraftUUID';
import express, { Response } from 'express';
import admin from 'firebase-admin';
import got from 'got';
import * as jwt from 'jsonwebtoken';
import { compareAsc } from 'date-fns';
import { Request } from '../../../models/extended-request';
import { User, UsersCollection } from '../../../models/user';
import { isAuthenticated } from '../../../middlewares/auth';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await UsersCollection.where(
      'username',
      '==',
      username,
    ).get();

    if (!existingUser.empty) {
      throw new Error('Username already in use!');
    }

    const { uid } = await admin
      .auth()
      .createUser({ email, password, displayName: username });
    const token = jwt.sign({ uid }, process.env.JWT_SECRET);
    const uuidGeneratorResponse = await got.get(
      `${process.env.UUID_GENERATOR_URL}/${username}`,
    );

    if (!uuidGeneratorResponse.body) {
      throw new Error();
    }

    const uuidGeneratorObj: MinecraftUUID = JSON.parse(
      uuidGeneratorResponse.body,
    );
    const minecraftUUID = uuidGeneratorObj.offlinesplitteduuid;

    const user: User = {
      uid,
      username,
      email,
      minecraftUUID,
      paymentStatus: paymentStatusEnum.expired,
      lastPaymentDate: null,
      paymentExpirationDate: new Date(),
    };

    await UsersCollection.doc(uid).set(user);

    req.user = user;
    req.uid = uid;

    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      signed: true,
    });

    return res.status(200).send({ user });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      throw new Error();
    }

    const userRecord = await admin.auth().getUser(uid);
    const userDocument = await UsersCollection.doc(uid).get();

    if (!userDocument.exists) {
      throw new Error('User not exists!');
    }

    const user: User = {
      ...(userDocument.data() as User),
      email: userRecord.email,
    };

    req.user = user;
    req.uid = uid;

    const token = jwt.sign({ uid }, process.env.JWT_SECRET);

    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      signed: true,
    });

    return res.status(200).send({ user });
  } catch (error) {
    return res.status(400).send();
  }
});

router.get('/me', isAuthenticated, async (req: Request, res: Response) => {
  try {
    return res.status(200).send(req.user);
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
  const userData: User = {} as User;

  if (!isValidOperation) {
    return res.status(400).send('Error: Invalid updates!');
  }

  try {
    updates.forEach(update => (userData[update] = req.body[update]));

    await admin.auth().updateUser(req.uid, userData);

    delete userData['password'];

    if (userData.hasOwnProperty('username')) {
      const uuidGeneratorResponse = await got.get(
        `${process.env.UUID_GENERATOR_URL}/${userData.username}`,
      );

      if (!uuidGeneratorResponse.body) {
        throw new Error();
      }

      const minecraftUUID: MinecraftUUID = JSON.parse(
        uuidGeneratorResponse.body,
      );

      userData.minecraftUUID = minecraftUUID.offlinesplitteduuid;
    }

    await UsersCollection.doc(req.uid).update(userData);

    const user: User = {
      ...req.user,
      ...userData,
    };

    req.user = user;

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/me', isAuthenticated, async (req: Request, res: Response) => {
  try {
    await admin.auth().deleteUser(req.uid);
    await UsersCollection.doc(req.uid).delete();

    delete req.user;
    delete req.uid;

    res.clearCookie(process.env.COOKIE_NAME);
    res.status(200).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

export { router as userRouter };
