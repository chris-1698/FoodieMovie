import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { orderRouter } from './routers/orderRouter';
import { userRouter } from './routers/userRouter';
import { keyRouter } from './routers/keyRouter';
// import { screenRouter } from './routers/screenRouter';

// .env configurations
dotenv.config();

// Mongoose configuration
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/foodie-movie-db'; //Protocolo
mongoose.set('strictQuery', true);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error('Error mongodb: ', err);
  });

// Express configuration
const app = express();
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  })
);

//Middlewares to access the body of the POST request from the api handler (userRouter, orderRouter...)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/keys', keyRouter);
// app.use('/api/screens', screenRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
