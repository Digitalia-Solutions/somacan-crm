import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ContactSubmission = sequelize.define('ContactSubmission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('new', 'in_progress', 'resolved', 'archived'),
    allowNull: false,
    defaultValue: 'new',
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'contact_page',
  },
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

export default ContactSubmission;
