import { useEffect, useState } from 'react';
import { getProduct, getProducts } from '../lib/api';

function toNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeProduct(product) {
  if (!product || typeof product !== 'object') {
    return product;
  }

  return {
    ...product,
    price: toNumber(product.price, 0),
    oldPrice: product.oldPrice === null || product.oldPrice === undefined || product.oldPrice === ''
      ? undefined
      : toNumber(product.oldPrice, 0),
    originalPrice: product.originalPrice === null || product.originalPrice === undefined || product.originalPrice === ''
      ? undefined
      : toNumber(product.originalPrice, 0),
    stock: product.stock === null || product.stock === undefined || product.stock === ''
      ? undefined
      : toNumber(product.stock, 0),
    discount: toNumber(product.discount, 0),
    rating: product.rating === null || product.rating === undefined || product.rating === ''
      ? undefined
      : toNumber(product.rating, 0),
    reviews: product.reviews === null || product.reviews === undefined || product.reviews === ''
      ? undefined
      : toNumber(product.reviews, 0),
  };
}

export function useProducts(query = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    getProducts(query)
      .then((data) => {
        if (active) {
          setProducts(Array.isArray(data) ? data.map(normalizeProduct) : []);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [JSON.stringify(query)]);

  return { products, loading, error };
}

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    let active = true;

    setLoading(true);
    setError(null);

    getProduct(slug)
      .then((data) => {
        if (active) {
          setProduct(normalizeProduct(data));
        }
      })
      .catch((err) => {
        if (active) {
          setError(err);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return { product, loading, error };
}
