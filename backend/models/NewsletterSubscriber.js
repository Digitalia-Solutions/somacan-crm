import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const NewsletterSubscriber = sequelize.define('NewsletterSubscriber', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  firstName: { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
  source: { type: DataTypes.STRING, allowNull: false, defaultValue: 'newsletter_section' },
  status: {
    type: DataTypes.ENUM('active', 'unsubscribed'),
    allowNull: false,
    defaultValue: 'active',
  },
}, { timestamps: true, createdAt: 'createdAt', updatedAt: 'updatedAt' });

export default NewsletterSubscriber;
