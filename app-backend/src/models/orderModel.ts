import {
  modelOptions,
  prop,
  getModelForClass,
  Ref,
} from '@typegoose/typegoose';
import { CartItem } from '../types/CartItem';
import { UserInfo } from '../types/UserInfo';
import { OrderDetails } from '../types/OrderDetails';
import { User } from './userModel';
import { PaginateModel, Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

class Item {
  @prop({ required: true })
  public name!: string;
  @prop({ required: true })
  public quantity!: string;
  @prop({ required: true })
  public image!: number;
  @prop({ required: true })
  public price!: number;
  @prop({ ref: 'CartItem' })
  public cartItem?: Ref<CartItem>;
}

class PaymentResult {
  @prop()
  public paymentId!: string;
  @prop()
  public status!: string;
  @prop()
  public updateTime!: string;
  @prop()
  public emailAddress!: string;
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Order {
  public _id!: string;

  @prop()
  public orderItems!: Item[];

  @prop()
  public orderDetails?: OrderDetails;

  @prop({ ref: 'User' })
  public user?: Ref<User>;

  @prop()
  public paymentMethod!: string;

  @prop()
  public paymentResult?: PaymentResult;

  @prop({ required: true })
  public createdAt!: Date;

  @prop()
  public promoId?: string;

  @prop({ default: false })
  public promoApplied?: boolean;

  @prop({ required: true, default: false })
  public isPaid!: boolean;

  @prop({ required: false, default: false })
  public isCancelled?: boolean;

  @prop({ required: true, default: false })
  public isDelivered!: boolean;

  @prop({})
  public paidAt!: Date;

  @prop({ required: true, default: 0 })
  public itemsPrice!: number;

  @prop({ required: true, default: 0 })
  public taxPrice!: number;

  @prop({ required: true, default: 0 })
  public totalPrice!: number;

  @prop({ required: true })
  public pickUpCode!: string;
}

interface IOrder extends Document {
  _id: String;
  orderItems: Item[];
  orderDetails: OrderDetails;
  user: Ref<User>;
  paymentMethod: String;
  paymentResult: PaymentResult;
  createdAt: Date;
  isPaid: boolean;
  isDelivered: boolean;
  isCancelled: boolean;
  paidAt: Date;
  itemsPrice: Number;
  totalPrice: Number;
  pickUpCode: String;
}

const OrderSchema: Schema = getModelForClass(Order).schema;
OrderSchema.plugin(mongoosePaginate);
interface OrderModel<T extends Document> extends PaginateModel<T> {}

// https://stackoverflow.com/questions/42859759/error-calling-paginate-after-import-schema-within-plugin
export const OrderModel: OrderModel<IOrder> = model<IOrder>(
  'Order',
  OrderSchema
) as OrderModel<IOrder>;
