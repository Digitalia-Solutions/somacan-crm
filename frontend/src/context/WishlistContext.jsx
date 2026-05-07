import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext();
const WISHLIST_STORAGE_KEY = 'somacan-wishlist';

function getProductId(product) {
  return product?._id || product?.id || product?.slug;
}

function normalizeWishlistItem(product) {
  const price = Number(product?.price);

  return {
    ...product,
    _id: getProductId(product),
    price: Number.isFinite(price) ? price : 0,
  };
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToWishlist = useCallback((product) => {
    const itemId = getProductId(product);
    if (!itemId) return;

    const normalizedItem = normalizeWishlistItem(product);

    setItems((prev) => (
      prev.some((item) => item._id === itemId)
        ? prev
        : [...prev, normalizedItem]
    ));
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item._id !== productId));
  }, []);

  const toggleWishlist = useCallback((product) => {
    const itemId = getProductId(product);
    if (!itemId) return false;

    const exists = items.some((item) => item._id === itemId);
    if (exists) {
      removeFromWishlist(itemId);
      return false;
    }

    addToWishlist(product);
    return true;
  }, [addToWishlist, items, removeFromWishlist]);

  const isWishlisted = useCallback((productId) => (
    items.some((item) => item._id === productId)
  ), [items]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
        totalItems: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
