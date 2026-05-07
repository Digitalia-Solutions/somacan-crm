import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ThemeSettings = sequelize.define('ThemeSettings', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  scope: { type: DataTypes.STRING, allowNull: false, unique: true, defaultValue: 'default' },
  // Colors
  primaryColor:     { type: DataTypes.STRING, defaultValue: '#033a22' },
  secondaryColor:   { type: DataTypes.STRING, defaultValue: '#1c1917' },
  accentColor:      { type: DataTypes.STRING, defaultValue: '#d49a2e' },
  backgroundColor:  { type: DataTypes.STRING, defaultValue: '#fcfaf7' },
  textColor:        { type: DataTypes.STRING, defaultValue: '#1c1917' },
  // Typography
  headingFont:      { type: DataTypes.STRING, defaultValue: 'Aariana, serif' },
  bodyFont:         { type: DataTypes.STRING, defaultValue: 'Manrope, sans-serif' },
  // Layout
  borderRadius:     { type: DataTypes.STRING, defaultValue: '1rem' },
  containerWidth:   { type: DataTypes.STRING, defaultValue: '1400px' },
  sectionPadding:   { type: DataTypes.STRING, defaultValue: '6rem 2.5rem' },
  // Styles (JSON)
  buttonStyle:      { type: DataTypes.JSON, defaultValue: { borderRadius: '9999px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '10px' } },
  cardStyle:        { type: DataTypes.JSON, defaultValue: { borderRadius: '1.5rem', shadow: '0 18px 60px rgba(28,25,23,0.06)', border: '1px solid rgba(28,25,23,0.08)' } },
}, {
  timestamps: true,
});

export default ThemeSettings;
