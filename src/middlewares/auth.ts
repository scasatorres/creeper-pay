import { NextFunction, Response } from 'express';
import { Request } from './../models/extended-request';
import admin from 'firebase-admin';

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.uid = decodedToken.uid;

    next();
  } catch (error) {
    res.status(401).send(error);
  }
};

export { isAuthenticated };
