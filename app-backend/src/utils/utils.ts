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
  // TODO: borrar log
  console.log('Token: ', authorization);

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
    // TODO: Borrar log
    console.log('\nReq.user: ', req.user);
    next();
  } else {
    res.status(401).json({ message: 'No Token' });
    // TODO: Borrar log
    console.log('Aaaa ', res.status(401).statusMessage);
  }
};
