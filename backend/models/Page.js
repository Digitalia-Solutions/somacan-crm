import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { TEMPLATE_KEYS } from '../../shared/cms/templates.js';

const Page = sequelize.define('Page', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  template: {
    type: DataTypes.ENUM(...TEMPLATE_KEYS),
    allowNull: false,
    defaultValue: 'custom',
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  metaTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  metaDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ogImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  canonicalUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  templateConfig: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['slug'],
    },
  ],
});

export default Page;
