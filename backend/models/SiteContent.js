import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * SiteContent — each row is a section within a page.
 *
 * The `content` JSON field stores section-specific data AND styling:
 * {
 *   // --- Content fields (varies by contentType) ---
 *   headline: "...",
 *   body: "...",
 *   image: "...",
 *
 *   // --- Styling fields (optional, all types) ---
 *   style: {
 *     backgroundColor, textColor, borderColor, borderRadius,
 *     padding, marginTop, marginBottom, minHeight,
 *     backgroundImage, backgroundSize, backgroundPosition,
 *     opacity, boxShadow, customClasses
 *   },
 *
 *   // --- Hero-specific (contentType === 'hero') ---
 *   hero: {
 *     overlayColor, overlayOpacity,
 *     textPosition: "center" | "left" | "right",
 *     ctaButtonStyle: { backgroundColor, textColor, hoverColor, borderRadius, padding }
 *   }
 * }
 */
const SiteContent = sequelize.define('SiteContent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pageKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sectionKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contentType: {
    type: DataTypes.ENUM('hero', 'section', 'menu', 'theme', 'footer', 'form', 'categories', 'faq', 'stats', 'gallery'),
    allowNull: false,
    defaultValue: 'section',
  },
  content: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  animation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  animationDelay: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  cssClasses: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['pageKey', 'sectionKey'],
    },
  ],
});

export default SiteContent;
