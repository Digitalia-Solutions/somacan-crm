import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2)
  },
  category: {
    type: DataTypes.ENUM('oil', 'body', 'face', 'hair', 'tea', 'wellness'),
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  mainImage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ingredients: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  benefits: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  usage: {
    type: DataTypes.TEXT
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  stockCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isBestseller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default Product;
