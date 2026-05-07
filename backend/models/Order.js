import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  customer: {
    type: DataTypes.JSON,
    allowNull: false
    // Expected structure: { firstName, lastName, email, phone, address, city, postalCode }
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false
    // Expected structure: Array of { product_id, name, quantity, price, image }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  couponCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  couponSnapshot: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  shippingSnapshot: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash_on_delivery', 'bank_transfer'),
    allowNull: false,
    defaultValue: 'cash_on_delivery'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  orderAccessToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  guestAccountToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  guestConvertedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default Order;
