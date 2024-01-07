// import express, { Request, Response } from 'express';
// import asyncHandler from 'express-async-handler';

// import { ScreenModel } from '../models/screenModel';
// import { isAuth } from '../utils/utils';

// export const screenRouter = express.Router();

// screenRouter.get(
//   '/',
//   isAuth,
//   asyncHandler(async (req, res) => {
//     const screensList = await ScreenModel.find();
//     if (screensList) {
//       res.json(screensList);
//     } else {
//       res.status(404).json({ message: 'No screens found' });
//     }
//   })
// );

// screenRouter.get(
//   '/allScreens',
//   isAuth,
//   asyncHandler(async (req, res) => {
//     const screenNumbers = await ScreenModel.find({}, 'screenNumber');
//     if (screenNumbers) {
//       res.json(screenNumbers);
//     } else {
//       res.status(404).json({ message: 'No screens found' });
//     }
//   })
// );

// screenRouter.get(
//   '/:screenNumber/seats/',
//   isAuth,
//   asyncHandler(async (req, res) => {
//     const { screenNumber } = req.params;
//     const theScreen = await ScreenModel.findOne({ screenNumber });
//     if (theScreen) {
//       res.json({ screenSeats: theScreen.seats });
//     } else {
//       res.status(404).json({ message: 'No seats found for this ' });
//     }
//   })
// );
