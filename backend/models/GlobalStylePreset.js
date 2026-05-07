import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const GlobalStylePreset = sequelize.define('GlobalStylePreset', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  scope: {
    type: DataTypes.ENUM('button', 'card', 'section', 'typography'),
    allowNull: false,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  styles: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
  isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'GlobalStylePresets',
  timestamps: true,
  indexes: [{ fields: ['scope'] }, { unique: true, fields: ['slug'] }],
});

export default GlobalStylePreset;
