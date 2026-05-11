/**
 * ProductRelated — CMS section rendered below product detail pages.
 * Shows a "Vous aimerez aussi" related products grid.
 *
 * Usage:
 *   <ProductRelated
 *     eyebrow="Dans le même univers"
 *     title="Vous aimerez aussi."
 *     maxItems={4}
 *     currentSlug="some-product-slug"
 *   />
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getProducts } from '../lib/api';
import ProductCard from '../components/ui/ProductCard';

export default function ProductRelated({
  eyebrow = 'Dans le même univers',
  title = 'Vous aimerez aussi.',
  maxItems = 4,
  currentSlug = '',
}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then((data) => {
        const all = Array.isArray(data) ? data : data?.data ?? [];
        const filtered = currentSlug
          ? all.filter((p) => p.slug !== currentSlug)
          : all;
        setProducts(filtered.slice(0, maxItems));
      })
      .catch(() => {
        setProducts([]);
      });
  }, [currentSlug, maxItems]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="section-padding pt-20 pb-24 bg-[#fcfaf7]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">
            {eyebrow}
          </p>
          <h2 className="font-display text-4xl text-somacan-brand md:text-6xl">
            {title}
          </h2>
        </div>
        <div className="grid gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
            <motion.div
              key={product._id || product.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: Math.min(i * 0.05, 0.3) }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
