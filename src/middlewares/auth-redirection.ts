import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Request } from './../models/extended-request';

const authenticatedRedirection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.signedCookies;
    if (!token) {
      return next();
    }

    jwt.verify(token, process.env.JWT_SECRET);

    return res.redirect('/views/users/account');
  } catch (error) {
    res.clearCookie(process.env.COOKIE_NAME);
    res.redirect('/');
  }
};

const unauthenticatedRedirection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.signedCookies;
    if (!token) {
      return res.redirect('/');
    }

    jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (error) {
    res.clearCookie(process.env.COOKIE_NAME);
    res.redirect('/');
  }
};

export { authenticatedRedirection, unauthenticatedRedirection };
