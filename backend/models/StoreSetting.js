import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StoreSetting = sequelize.define('StoreSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  scope: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: 'default',
  },
  baseShippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 30,
  },
  freeShippingThreshold: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 400,
  },
  cityRates: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  allowGuestCheckout: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  guestAccountInviteEnabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'MAD',
  },
  smtpHost: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
  smtpPort: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 587,
  },
  smtpUser: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
  smtpPass: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
  mailFrom: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
  adminEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

export default StoreSetting;
