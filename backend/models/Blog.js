import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  excerpt: {
    type: DataTypes.TEXT,
  },
  intro: {
    type: DataTypes.TEXT,
  },
  sections: {
    type: DataTypes.JSON,
  },
  coverImage: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  },
  author: {
    type: DataTypes.STRING,
    defaultValue: 'Somacan Team'
  },
  readTime: {
    type: DataTypes.STRING
  },
  publishedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default Blog;
