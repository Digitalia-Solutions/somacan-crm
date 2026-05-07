import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Media = sequelize.define('Media', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  filename: { type: DataTypes.STRING, allowNull: false },
  url:      { type: DataTypes.STRING, allowNull: false },
  mimeType: { type: DataTypes.STRING, allowNull: false, defaultValue: 'image/jpeg' },
  size:     { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // bytes
  altText:  { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
  title:    { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
  folder:   { type: DataTypes.STRING, allowNull: false, defaultValue: 'uploads' },
}, { tableName: 'Media', timestamps: true });

export default Media;
