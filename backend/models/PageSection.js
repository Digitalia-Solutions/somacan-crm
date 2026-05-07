import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PageSection = sequelize.define('PageSection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Pages',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  pageSlug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  content: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  settings: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  animation: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  responsive: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  seo: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  widgetTree: { type: DataTypes.JSON, allowNull: true, defaultValue: null },
  globalStyleOverrides: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
  templateLock: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['pageSlug'],
    },
    {
      fields: ['pageId'],
    },
  ],
});

export default PageSection;
