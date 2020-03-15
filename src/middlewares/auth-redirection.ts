import { NextFunction, Response } from 'express';
import { Request } from './../models/extended-request';

const authenticatedRedirection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { token } = req.signedCookies;
  if (token) {
    return res.redirect('/views/users/profile');
  }

  next();
};

const unauthenticatedRedirection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { token } = req.signedCookies;
  if (!token) {
    return res.redirect('/');
  }

  next();
};

export { authenticatedRedirection, unauthenticatedRedirection };
