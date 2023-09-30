import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { User, UserModel } from '../models/userModel';
import { sampleUsers } from '../data';
import { generateToken } from '../utils/utils';

export const userRouter = express.Router();

userRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    await UserModel.deleteMany({});
    const createdUsers = await UserModel.insertMany(sampleUsers);

    res.json({ createdUsers });
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
      // Bookmark: 4:04:21 https://www.youtube.com/watch?v=-ifcPnXHn8Q&ab_channel=CodingwithBasir
    });
  })
);
