//Json Web Token resources
import jwt from 'jsonwebtoken';
import jwtdecode from 'jwt-decode';
//Express resources
import { NextFunction, Request, Response, json } from 'express';

//JSCookie resources
import Cookies from 'cookies';
import { UserInfo } from '../types/UserInfo';
import { createPrivateKey } from 'crypto';
import { User } from '../models/userModel';

export const generateToken = (user: User) => {
  // const thisSession = useSession();
  // return thisSession.session?.getToken({
  //   template: 'foodie-movie-jwt',
  // });
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || 'somethingsecret',
    {
      expiresIn: '30d',
    }
  );
};

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  console.log(authorization);

  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    console.log('Qué es esto aaaaaaaa ', token);

    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET || 'somethingsecret'
    );

    req.user = decode as {
      _id: string;
      name: string;
      lastName: string;
      email: string;
      dateOfBirth: string;
      isAdmin: boolean;
      token: string;
    };
    console.log('\nReq.user: ', req.user);
    next();
  } else {
    res.status(401).json({ message: 'No Token' });
    console.log('Aaaa ', res.status(401).statusMessage);
  }

  // jwt.verify(token, jwtKey, { algorithms: ['HS256'] }, (err, decoded) => {
  //   if (err) {
  //     return res.status(401).json(err.message);
  //   }
  //   req.user = decoded as {
  //     userId: string;
  //     fullName: string;
  //     email: string;
  //     token: string;
  //   };
  //   console.log('Válido');

  //   next();
  // });
  // const token = authorization.slice(7, authorization.length);

  // console.log('Token:', jwt.decode(token!));

  // const token = req.headers.authorization;
  //Metodo que uso ahora
  // if (authorization) {
  //   const token = authorization.slice(7, authorization.length);
  //   //  authorization.slice(7, authorization.length);
  //   console.log('El token de authorization es:', token);
  //   const decode = jwt.verify(token!, jwtKey!, { algorithms: ['RS256'] });
  //   req.user = decode as {
  //     userId: string;
  //     fullName: string;
  //     email: string;
  //     token: string;
  //   };
  //   next();
  // } else {
  //   res.status(401).json({ message: 'No Token' });
  // }
  //--------------------------------------------------

  // const publicKey = process.env.VITE_REACT_CLERK_PUBLISHABLE_KEY;
  // const cookies = new Cookies(req, res); //Si no, desinstalar cookies y @types/cookies
  // const sessToken = cookies.get('__session');
  // const token = req.headers.authorization;
  // console.log(token);

  // if (sessToken === undefined && token === undefined) {
  //   res.status(401).json({ error: 'not signed in' });
  //   return;
  // }
  // try {
  //   let decoded = '';
  //   if (token) {
  //     decoded = jwt.verify(token, publicKey || 'somethingPublic');
  //     res.status(200).json({ sesstoken: decoded });
  //   } else {
  //     decoded = jwt.verify(sessToken, publicKey || 'somethingPublic');
  //     res.status(200).json({ sesstoken: decoded });
  //     return;
  //   }
  // } catch (error) {
  //   res.status(400).json({
  //     error: error.message,
  //   });
  //   return;
  // }
};
