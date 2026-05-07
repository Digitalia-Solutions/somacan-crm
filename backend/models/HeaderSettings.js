import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const logoDark = '/public/asset/cropped-LOGO_SOMACAN_SHOP__1_-removebg-preview.webp';

const HeaderSettings = sequelize.define('HeaderSettings', {
  id:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  scope: { type: DataTypes.STRING, allowNull: false, unique: true, defaultValue: 'default' },
  logo:  { type: DataTypes.JSON, defaultValue: { src: logoDark, alt: 'Somacan', width: 180 } },
  navLinks: { type: DataTypes.JSON, defaultValue: [
    { label: 'Accueil', href: '/', isExternal: false },
    { label: 'Boutique', href: '/shop', isExternal: false },
    { label: 'Notre Histoire', href: '/about', isExternal: false },
    { label: 'Journal', href: '/blog', isExternal: false },
    { label: 'Contact', href: '/contact', isExternal: false },
  ]},
  ctaButton: { type: DataTypes.JSON, defaultValue: { label: '', href: '', variant: 'primary' } },
  settings: { type: DataTypes.JSON, defaultValue: {
    sticky: true,
    transparent: false,
    transparentScrollThreshold: 50,
    hideOnHomeTop: true,
  }},
  theme: { type: DataTypes.JSON, defaultValue: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    stickyBackgroundColor: 'rgba(255,255,255,0.90)',
    textColor: '#043920B3',
    stickyTextColor: '#043920',
    activeColor: '#043920',
    iconColor: '#043920',
    stickyIconColor: '#043920',
    mobileBackgroundColor: '#ffffff',
    backdropBlur: '12px',
    shadowColor: 'rgba(28,25,23,0.08)',
  }},
}, { tableName: 'HeaderSettings', timestamps: true });

export default HeaderSettings;
