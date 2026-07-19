import { Model } from 'mongoose';

import User, { IUser } from './User';
import Product, { IProduct } from './Product';
import ProductVariant, { IProductVariant } from './ProductVariant';
import Category, { ICategory } from './Category';
import Order, { IOrder } from './Order';
import Review, { IReview } from './Review';
import Inventory, { IInventory } from './Inventory';
import Media, { IMedia } from './Media';
import Settings, { ISettings } from './Settings';
import Analytics, { IAnalytics } from './Analytics';
import Coupon, { ICoupon } from './Coupon';
import Wishlist, { IWishlist } from './Wishlist';
import Contact, { IContact } from './Contact';

export type ModelMap = {
  User: Model<IUser>;
  Product: Model<IProduct>;
  ProductVariant: Model<IProductVariant>;
  Category: Model<ICategory>;
  Order: Model<IOrder>;
  Review: Model<IReview>;
  Inventory: Model<IInventory>;
  Media: Model<IMedia>;
  Settings: Model<ISettings>;
  Analytics: Model<IAnalytics>;
  Coupon: Model<ICoupon>;
  Wishlist: Model<IWishlist>;
  Contact: Model<IContact>;
};

const models: ModelMap = {
  User,
  Product,
  ProductVariant,
  Category,
  Order,
  Review,
  Inventory,
  Media,
  Settings,
  Analytics,
  Coupon,
  Wishlist,
  Contact,
};

export {
  models,
  User,
  Product,
  ProductVariant,
  Category,
  Order,
  Review,
  Inventory,
  Media,
  Settings,
  Analytics,
  Coupon,
  Wishlist,
  Contact,
};

export type {
  IUser,
  IProduct,
  IProductVariant,
  ICategory,
  IOrder,
  IReview,
  IInventory,
  IMedia,
  ISettings,
  IAnalytics,
  ICoupon,
  IWishlist,
  IContact,
};
