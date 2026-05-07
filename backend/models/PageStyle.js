import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * PageStyle — persists page-level visual styling (colors, fonts, spacing, custom CSS).
 *
 * The `styles` JSON field stores:
 * {
 *   backgroundColor: "#ffffff",
 *   textColor: "#043920",
 *   accentColor: "#d4a574",
 *   fontFamily: "Poppins",
 *   fontSizes: { h1: "48px", h2: "36px", body: "16px" },
 *   spacing: { padding: "40px", margin: "20px", gap: "16px" },
 *   customCSS: "/* custom tailwind classes or raw CSS * /"
 * }
 */
const PageStyle = sequelize.define('PageStyle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pageKey: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'FK-like reference to Page.slug',
  },
  styles: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
    comment: 'Page-level styling: colors, fonts, spacing, customCSS',
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['pageKey'],
    },
  ],
});

export default PageStyle;
