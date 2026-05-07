import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  excerpt: {
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
  },
  readTime: {
    type: DataTypes.STRING,
  },
  publishedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  intro: {
    type: DataTypes.TEXT,
  },
  sections: {
    type: DataTypes.JSON, // For sections with heading/body
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

export default Article;
