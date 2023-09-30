//Express resources
import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

//Project resources
import { OrderModel } from '../models/orderModel';
import { CartItem } from '../types/CartItem';
import { isAuth } from '../utils/utils';
import { ObjectId } from 'mongodb';
import generator from 'generate-password-ts';
import mongoose from 'mongoose';
import { Types } from 'mongoose';

export const orderRouter = express.Router();

// TODO: 5:18:21 https://www.youtube.com/watch?v=-ifcPnXHn8Q&ab_channel=CodingwithBasir
orderRouter.get(
  // /api/orders/:id
  '/:id',
  isAuth,
  asyncHandler(async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  })
);
//TODO: se puede borrar
// orderRouter.get(
//   '/',
//   // isAuth,
//   asyncHandler(async (req, res) => {
//     const orders = await OrderModel.find();
//     res.json(orders);
//   })
// );

orderRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
    } else {
      const createdOrder = await OrderModel.create({
        orderItems: req.body.orderItems.map((x: CartItem) => ({
          ...x,
          product: x._id,
        })),
        orderDetails: req.body.orderDetails,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        createdAt: Date.now(),
        //TODO: Bookmark at 5:04:50
        //TODO: Poner valores vacíos a los atributos que faltan aquí?
        pickUpCode: generator.generate({
          length: 12,
          numbers: true,
        }),
        user: req.user._id,
      });
      res.status(201).json({ message: 'Order created', order: createdOrder });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id).populate('user');
    if (order) {
      order.isPaid = true;
      order.paidAt = new Date(Date.now());
      order.paymentResult = {
        paymentId: req.body.id,
        status: req.body.status,
        updateTime: req.body.update_time,
        emailAddress: req.body.email_address,
      };
      const updatedOrder = await order.save();
      res.send({ order: updatedOrder, message: 'Order paid succesfully!' });
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  })
);

orderRouter.get(
  // TODO: Si aquí pongo "/mine", peta.
  // TODO: 27/09/2023
  // Fallaba porque estaba siguiendo el formato de
  // api/orders/:id, por lo que estaba tomando "mine" como id y fallaba al hacer
  // el casteo a Order, porque mine no es un ObjectId válido.
  // Respuesta de 43 likes https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id
  '/mine/orderHistory',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    // var mongoose = require('mongoose');
    // var id = mongoose.Types.ObjectId(req.user._id);
    // TODO: Revisar esto. ¿Usuario como undefined?
    // var id = new Types.ObjectId(req.user._id);
    // console.log('El id castrado?????? ', id);

    // if(mongoose.Types.ObjectId.isValid(req.user._id)) {
    const orders = await OrderModel.find({
      user: req.user._id,
    });
    res.json(orders);
    // } else { return}
  })
);
// Bookmark: 5:38:36 14-9-2023
