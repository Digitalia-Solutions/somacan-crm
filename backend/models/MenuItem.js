import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MenuItem = sequelize.define('MenuItem', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  menuId:   { type: DataTypes.INTEGER, allowNull: false },
  parentId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
  label:    { type: DataTypes.STRING, allowNull: false },
  url:      { type: DataTypes.STRING, allowNull: false, defaultValue: '/' },
  type:     { type: DataTypes.ENUM('internal', 'external', 'page'), allowNull: false, defaultValue: 'internal' },
  target:   { type: DataTypes.STRING, allowNull: false, defaultValue: '_self' }, // '_self' or '_blank'
  order:    { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: 'MenuItems', timestamps: true });

export default MenuItem;
