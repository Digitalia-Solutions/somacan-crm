import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PopupConfig = sequelize.define('PopupConfig', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, defaultValue: 'default' },
  enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  triggerType: { type: DataTypes.STRING, allowNull: false, defaultValue: 'delay' }, // delay | scroll | exit
  triggerValue: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 }, // seconds or scroll%
  showOnce: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  cookieDays: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 7 },
  title: { type: DataTypes.STRING, allowNull: true, defaultValue: 'Rejoignez le cercle' },
  subtitle: { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
  description: { type: DataTypes.TEXT, allowNull: true, defaultValue: '' },
  buttonText: { type: DataTypes.STRING, allowNull: true, defaultValue: "S'abonner" },
  placeholder: { type: DataTypes.STRING, allowNull: true, defaultValue: 'Votre email' },
  disclaimer: { type: DataTypes.TEXT, allowNull: true, defaultValue: 'Pas de spam · Désinscription libre' },
  successMessage: { type: DataTypes.STRING, allowNull: true, defaultValue: 'Merci, vous êtes des nôtres.' },
  bgColor: { type: DataTypes.STRING, allowNull: true, defaultValue: '#033a22' },
  textColor: { type: DataTypes.STRING, allowNull: true, defaultValue: '#ffffff' },
  collectName: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  showConditions: { type: DataTypes.TEXT, allowNull: true, defaultValue: '' },
}, { timestamps: true, createdAt: 'createdAt', updatedAt: 'updatedAt' });

export default PopupConfig;
