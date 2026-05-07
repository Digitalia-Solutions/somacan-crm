import dotenv from 'dotenv';
import sequelize from '../config/database.js';
import Product from '../models/Product.js';

dotenv.config();

const SOURCE_API = 'https://shop.somacan.ma/wp-json/wp/v2/product?per_page=100&_embed';

function decodeHtml(value = '') {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ndash;/g, '-')
    .replace(/&eacute;/g, 'e');
}

function stripHtml(value = '') {
  return decodeHtml(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function extractSection(html = '', title) {
  const normalized = html.replace(/\r/g, '');
  const pattern = new RegExp(`<h2[^>]*>\\s*<b>${title}<\\/b>\\s*<\\/h2>([\\s\\S]*?)(?:<h2|$)`, 'i');
  const match = normalized.match(pattern);
  return match ? match[1] : '';
}

function extractListItems(html = '') {
  return [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => stripHtml(match[1]).replace(/^[\-\s]+/, '').trim())
    .filter(Boolean);
}

function extractParagraphText(html = '') {
  return stripHtml(html).replace(/^- /gm, '').trim();
}

function normalizePrice(raw = '') {
  const normalized = raw.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  return Number.parseFloat(normalized);
}

async function fetchPrice(link) {
  const response = await fetch(link);
  if (!response.ok) {
    throw new Error(`Price fetch failed for ${link}: ${response.status}`);
  }

  const html = await response.text();
  const match = html.match(/woocommerce-Price-currencySymbol">MAD<\/span>\s*([0-9.,]+)/i);
  return match ? normalizePrice(match[1]) : null;
}

function mapCategory(product) {
  const wpCategory =
    product?._embedded?.['wp:term']?.[1]?.[0]?.slug ||
    product?._embedded?.['wp:term']?.[1]?.[0]?.name ||
    '';
  const title = decodeHtml(product?.title?.rendered || '').toLowerCase();
  const source = `${wpCategory} ${title}`.toLowerCase();

  if (source.includes('cheveux')) return 'hair';
  if (source.includes('the') || source.includes('thé') || source.includes('infusion') || source.includes('verveine') || source.includes('menthe')) return 'tea';
  if (source.includes('compl')) return 'wellness';
  if (source.includes('huile')) return 'oil';
  if (source.includes('corps')) return 'body';
  return 'face';
}

function buildImages(product) {
  const media = product?._embedded?.['wp:featuredmedia']?.[0];
  if (!media || media.code === 'rest_forbidden') {
    return [];
  }

  const sizes = media.media_details?.sizes || {};
  const imageSet = [
    media.source_url,
    sizes.woocommerce_single?.source_url,
    sizes.large?.source_url,
    sizes.medium_large?.source_url,
  ].filter(Boolean);

  return [...new Set(imageSet)];
}

function buildBenefits(product) {
  const benefitsHtml = extractSection(product?.content?.rendered || '', 'Bénéfices clés');
  return extractListItems(benefitsHtml);
}

function buildUsage(product) {
  const usageHtml = extractSection(product?.content?.rendered || '', 'Conseils d’utilisation');
  return extractParagraphText(usageHtml);
}

function buildDescription(product) {
  const excerpt = stripHtml(product?.excerpt?.rendered || '');
  if (excerpt) return excerpt;

  const contentText = stripHtml(product?.content?.rendered || '');
  return contentText.split('\n').slice(0, 3).join(' ').trim();
}

function buildTags(product) {
  const categoryName = product?._embedded?.['wp:term']?.[1]?.[0]?.name;
  return [categoryName, 'CBD', 'Somacan'].filter(Boolean);
}

function buildSeedFlags(index, category) {
  return {
    isFeatured: index < 6,
    isBestseller: index < 4 || category === 'wellness',
    rating: 4.6 + ((index % 3) * 0.1),
    reviewCount: 18 + (index * 7),
  };
}

async function importCatalog() {
  const response = await fetch(SOURCE_API);
  if (!response.ok) {
    throw new Error(`Catalog fetch failed: ${response.status}`);
  }

  const remoteProducts = await response.json();

  const mappedProducts = [];

  for (const [index, product] of remoteProducts.entries()) {
    const name = decodeHtml(product.title?.rendered || '').trim();
    const slug = product.slug;
    const category = mapCategory(product);
    const images = buildImages(product);
    const mainImage = images[0];
    const price = await fetchPrice(product.link);

    if (!name || !slug || !mainImage || !price) {
      continue;
    }

    const benefits = buildBenefits(product);
    const usage = buildUsage(product);
    const description = buildDescription(product);
    const flags = buildSeedFlags(index, category);

    mappedProducts.push({
      name,
      slug,
      description,
      price,
      category,
      images,
      mainImage,
      benefits,
      usage,
      ingredients: [],
      tags: buildTags(product),
      inStock: true,
      stockCount: 30 + (index * 3),
      ...flags,
    });
  }

  for (const productData of mappedProducts) {
    const [product, created] = await Product.findOrCreate({
      where: { slug: productData.slug },
      defaults: productData
    });

    if (!created) {
      await product.update(productData);
    }
  }

  console.log(`Imported ${mappedProducts.length} products from Somacan Shop.`);
}

async function main() {
  await sequelize.authenticate();
  console.log('Database connected.');
  await sequelize.sync();

  try {
    await importCatalog();
  } finally {
    await sequelize.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
