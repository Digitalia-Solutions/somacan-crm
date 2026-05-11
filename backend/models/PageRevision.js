import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PageRevision = sequelize.define('PageRevision', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pageSlug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  snapshot: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  savedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ['pageSlug'] },
    { fields: ['sectionId'] },
  ],
});

export default PageRevision;
