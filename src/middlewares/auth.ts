import { NextFunction, Response } from 'express';
import admin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';
import { Request } from './../models/extended-request';
import { UsersCollection, User } from '../models/user';

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.signedCookies;

    if (!token) {
      throw new Error('Please authenticate');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userRecord = await admin.auth().getUser(decodedToken.uid);
    const userDocument = await UsersCollection.doc(decodedToken.uid).get();

    if (!userDocument.exists) {
      throw new Error('User not exists!');
    }

    const user: User = {
      ...(userDocument.data() as User),
      email: userRecord.email,
    };

    req.user = user;
    req.uid = decodedToken.uid;

    next();
  } catch (error) {
    res.clearCookie(process.env.COOKIE_NAME);
    res.status(401).send(error);
  }
};

export { isAuthenticated };
