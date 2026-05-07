import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext();
const CART_STORAGE_KEY = 'somacan-cart';

function getProductId(product) {
  return product?._id || product?.id || product?.slug;
}

function normalizeCartItem(product, quantity = 1) {
  const itemQuantity = Number.isFinite(Number(quantity)) && Number(quantity) > 0 ? Number(quantity) : 1;
  const price = Number(product?.price);

  return {
    ...product,
    _id: getProductId(product),
    price: Number.isFinite(price) ? price : 0,
    quantity: itemQuantity,
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product, quantity = 1) => {
    const itemId = getProductId(product);
    if (!itemId) return;

    const normalizedItem = normalizeCartItem(product, quantity);

    setItems(prev => {
      const existing = prev.find(item => item._id === itemId);
      if (existing) {
        return prev.map(item => 
          item._id === itemId
            ? { ...item, ...normalizedItem, quantity: item.quantity + normalizedItem.quantity }
            : item
        );
      }
      return [...prev, normalizedItem];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems(prev => prev.filter(item => item._id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => prev.map(item => 
      item._id === productId ? { ...item, quantity } : item
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
