//Express resources
import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

//Project resources
import { OrderModel } from '../models/orderModel';
import { CartItem } from '../types/CartItem';
import { isAuth, isAuthAsEmployee } from '../utils/utils';
export const orderRouter = express.Router();

//Pick up code generator
import generator from 'generate-password-ts';

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

//Para limpiar la BBDD
orderRouter.delete(
  '/deleteAll',
  isAuthAsEmployee,
  asyncHandler(async (req: Request, res: Response) => {
    OrderModel.deleteMany({});
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
        isPaid: false,
        paidAt: '',
        isCancelled: false,
        isDelivered: false,
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
    if (order?.isCancelled === false) {
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
    } else {
      res.status(412).send({ message: 'Order is cancelled!' });
    }
  })
);

orderRouter.get(
  // 27/09/2023
  // Fallaba porque estaba siguiendo el formato de
  // api/orders/:id, por lo que estaba tomando "mine" como id y fallaba al hacer
  // el casteo a Order, porque mine no es un ObjectId válido.
  // Respuesta de 43 likes https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id
  '/mine/orderHistory',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({
      user: req.user._id,
    }).sort({ createdAt: -1, paidAt: -1 });
    res.json(orders);
  })
);

orderRouter.get(
  '/all/allOrders',
  isAuthAsEmployee,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({}).sort({
      createdAt: -1,
      paidAt: -1,
    });
    res.json(orders);
  })
);

orderRouter.get(
  '/orders/searchOrder/:searchTerm',
  isAuthAsEmployee,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({
      pickUpCode: { $regex: req.params.searchTerm || '' },
    });
    if (orders) {
      res.json(orders);
    } else {
      res.status(404).send({ message: 'No orders found' });
    }
  })
);

orderRouter.put(
  '/order/deliverOrder',
  isAuthAsEmployee,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.body.id);
    if (order?.isCancelled === false) {
      if (
        order &&
        order.isDelivered === false &&
        order.paymentMethod === 'PayPal'
      ) {
        order.isDelivered = true;
        const updatedOrder = await order.save();
        res.send({ order: updatedOrder, message: 'Order delivered!' });
      } else if (order && order?.isDelivered === true) {
        res.status(412).send({ message: 'Order already delivered!' });
      } else {
        res.status(404).send({ message: 'Order not found' });
      }
    } else {
      res.status(412).send({ message: 'Order is cancelled!' });
    }
  })
);

orderRouter.put(
  '/order/confirmOrder',
  isAuthAsEmployee,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.body.id);
    // console.log(order);
    // console.log(order?.paymentMethod === 'Cash');
    // console.log(order?.isDelivered);
    if (order?.isCancelled === false) {
      if (
        order &&
        order.paymentMethod === 'Cash' &&
        order.isDelivered === false &&
        order.isPaid === false
      ) {
        order.isDelivered = true;
        order.isPaid = true;
        order.paidAt = new Date();
        const updatedOrder = await order.save();
        res.send({ order: updatedOrder, message: 'Order confirmed!' });
      } else if (order && order.isDelivered === true && order.isPaid === true) {
        res.status(412).send({ message: 'Order already confirmed!' });
      } else {
        res.status(404).send({ message: 'Order not found' });
      }
    } else {
      res.status(412).send({ message: 'Order is cancelled!' });
    }
  })
);

orderRouter.put(
  `/order/cancelOrder`,
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    console.log(req.body.id);

    const order = await OrderModel.findById(req.body.id);
    console.log(order);

    if (order) {
      if (order!.isCancelled)
        res.status(412).send({ message: 'Order already cancelled!' });
      order.isCancelled = true;
      const cancelledOrder = await order.save();
      res.send({
        order: cancelledOrder,
        message: 'Order cancelled successfully',
      });
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  })
);
