//Express resources
import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

//Project resources
import { OrderModel } from '../models/orderModel';
import { CartItem } from '../types/CartItem';
import { isAuth } from '../utils/utils';

import generator from 'generate-password-ts';

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
orderRouter.get(
  '/',
  // isAuth,
  asyncHandler(async (req, res) => {
    const orders = await OrderModel.find();
    res.json(orders);
  })
);

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
          length: 10,
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
// Bookmark: 5:38:36 14-9-2023
