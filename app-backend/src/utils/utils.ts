//Json Web Token resources
import jwt from 'jsonwebtoken';

//Express resources
import { NextFunction, Request, Response, json } from 'express';

//Project resources
import { User } from '../models/userModel';

export const generateToken = (user: User) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || 'secretkey',
    {
      expiresIn: '1d',
    }
  );
};

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    const decode = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

    req.user = decode as {
      _id: string;
      name: string;
      lastName: string;
      email: string;
      dateOfBirth: string;
      isAdmin: boolean;
      token: string;
    };

    next();
  } else {
    res.status(401).json({ message: 'No Token' });
  }
};

export const isAuthAsAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    const decode = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

    req.user = decode as {
      _id: string;
      name: string;
      lastName: string;
      email: string;
      dateOfBirth: string;
      isAdmin: boolean;
      token: string;
    };
    if (req.user.isAdmin === true) {
      next();
    } else {
      res.status(401).json({ message: 'User has no privileges.' });
    }
  } else {
    res.status(401).json({ message: 'No Token' });
  }
};

export const baseUrl = () =>
  process.env.MAIL_BASE_URL
    ? process.env.MAIL_BASE_URL
    : process.env.NODE_ENV !== 'production'
    ? 'http://localhost:5173'
    : 'https://dominio.com';
