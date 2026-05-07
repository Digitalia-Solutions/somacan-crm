import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const FooterSettings = sequelize.define('FooterSettings', {
  id:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  scope: { type: DataTypes.STRING, allowNull: false, unique: true, defaultValue: 'default' },
  logo:  { type: DataTypes.JSON, defaultValue: { src: '', alt: 'Somacan', width: 208 } },
  description: { type: DataTypes.TEXT, defaultValue: "Pionnier du cannabis légal au Maroc. Nous combinons le meilleur de la nature et du CBD pour offrir des solutions de soin naturel d'exception." },
  columns: { type: DataTypes.JSON, defaultValue: [
    { title: 'Liens rapides', links: [
      { label: 'Boutique', href: '/shop' },
      { label: 'Notre histoire', href: '/about' },
      { label: 'Journal', href: '/blog' },
      { label: 'Accueil', href: '/' },
    ]},
  ]},
  socials: { type: DataTypes.JSON, defaultValue: [
    { platform: 'Instagram', href: '#', icon: 'I' },
    { platform: 'Facebook', href: '#', icon: 'F' },
    { platform: 'TikTok', href: '#', icon: 'T' },
  ]},
  newsletter: { type: DataTypes.JSON, defaultValue: {
    enabled: false,
    title: 'Newsletter',
    placeholder: 'Votre email',
    buttonText: "S'abonner",
  }},
  legal: { type: DataTypes.JSON, defaultValue: {
    copyright: '© 2026 Somacan. Tous droits réservés.',
    links: [
      { label: 'Politique de confidentialité', href: '#' },
      { label: 'Conditions générales', href: '#' },
    ],
  }},
  contact: { type: DataTypes.JSON, defaultValue: {
    email: 'contact@somacan.ma',
    phone: '+212 5XX-XXXXXX',
    address: 'Casablanca, Maroc',
  }},
  theme: { type: DataTypes.JSON, defaultValue: {
    backgroundColor: '#1c1917',
    textColor: '#d6d3d1',
    headingColor: '#ffffff',
    accentColor: '#d49a2e',
    borderColor: 'rgba(255,255,255,0.10)',
  }},
}, { tableName: 'FooterSettings', timestamps: true });

export default FooterSettings;
