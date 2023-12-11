import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { User, UserModel } from '../models/userModel';
import { sampleUsers } from '../data';
import { baseUrl, generateToken, isAuth } from '../utils/utils';
import jwt from 'jsonwebtoken';

export const userRouter = express.Router();

userRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const createdUsers = await UserModel.insertMany(sampleUsers);

    res.json({ createdUsers });
  })
);

userRouter.get(
  '/allUsers',
  asyncHandler(async (req: Request, res: Response) => {
    const allUsers = await UserModel.find();
    res.json({ allUsers });
  })
);

//POST /api/users/signin
userRouter.post(
  '/signin',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.json({
          _id: user._id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
          dateOfBirth: user.dateOfBirth,
          token: generateToken(user),
        });
        return;
      }
    }

    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.create({
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    } as User);
    res.json({
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      dateOfBirth: user.dateOfBirth,
      token: generateToken(user),
    });
  })
);

userRouter.post(
  '/forgot-password',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({
      email: req.body.email,
    });
    if (user) {
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET || 'secretkey',
        {
          expiresIn: '2h',
        }
      );
      // Revisar error al cambiar contraseña con el enlace del correo
      // En el correo se manda otro token distinto al que
      // se imprime por pantalla en VSC
      // Update: Solucionado. Estaba mandando un token anterior.
      user.resetToken = token;
      await user.save();
      // Reset link
      const link = `${baseUrl()}/reset-password/${token}/`;
      // For reset password trials
      // console.log(link);

      res.json({
        token: token,
        name: user.name,
        link: link,
      });
    } else {
      res.status(404).send({ message: 'User not found.' });
    }
  })
);

userRouter.post(
  '/reset-password',
  asyncHandler(async (req: Request, res: Response) => {
    jwt.verify(
      req.body.token,
      process.env.JWT_SECRET || 'secretkey',
      async (err: any, decode: any) => {
        if (err) {
          res.status(401).send({ message: 'Invalid token.' });
        } else {
          const user = await UserModel.findOne({ resetToken: req.body.token });
          // User info
          if (user) {
            if (req.body.password) {
              user.password = bcrypt.hashSync(req.body.password, 8);
              await user.save();
              res.send({
                message: 'Password reseted successfully.',
              });
              user.resetToken = '';
              await user.save();
            }
          } else {
            res.status(404).send({ message: 'User not found.' });
          }
        }
      }
    );
  })
);

userRouter.delete(
  '/delete-user',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      await UserModel.findByIdAndDelete(user._id);
      res.send({
        message: 'User deleted successfully.',
      });
    } else {
      res.status(404).send({ message: 'User not found.' });
    }
  })
);
