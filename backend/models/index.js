import Product from './Product.js';
import Category from './Category.js';
import Page from './Page.js';
import Menu from './Menu.js';
import MenuItem from './MenuItem.js';
import SiteContent from './SiteContent.js';
import PageSection from './PageSection.js';
import GlobalStylePreset from './GlobalStylePreset.js';

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Page.hasMany(PageSection, { foreignKey: 'pageId', as: 'sections', onDelete: 'CASCADE' });
PageSection.belongsTo(Page, { foreignKey: 'pageId', as: 'page' });

Menu.hasMany(MenuItem, { foreignKey: 'menuId', as: 'menuItems', onDelete: 'CASCADE' });
MenuItem.belongsTo(Menu, { foreignKey: 'menuId', as: 'menu' });
MenuItem.hasMany(MenuItem, { foreignKey: 'parentId', as: 'children', onDelete: 'SET NULL' });
MenuItem.belongsTo(MenuItem, { foreignKey: 'parentId', as: 'parent' });

export {
  Product,
  Category,
  Page,
  Menu,
  MenuItem,
  SiteContent,
  PageSection,
  GlobalStylePreset,
};
