import React from 'react';
import ProductCard from './ProductCard';

// Sample data exactly as requested + a few more for the grid
const SAMPLE_PRODUCTS = [
  {
    id: "p-001",
    name: "Sleep 30 Dissolvable Wafers",
    category: "Sleep",
    image: new URL('../../public/asset/Huile_relaxante_Produit_-removebg-preview.png', import.meta.url).href,
    price: 25.5,
    oldPrice: 35,
    rating: 4.8,
    reviews: 124,
    discount: 27,
    badge: "Best Seller",
    stock: 12,
    colors: [
      { name: "Rose", value: "#C21F4A", image: new URL('../../public/asset/Huile_relaxante_Produit_-removebg-preview.png', import.meta.url).href },
      { name: "Dark Red", value: "#8B0D2C", image: new URL('../../public/asset/Huile de Visage (Produit).png', import.meta.url).href }
    ]
  },
  {
    id: "p-002",
    name: "Vitality Boost CBD Tincture",
    category: "Wellness",
    image: new URL('../../public/asset/Soin-intensif-corps-ARGAN-Produit-2-removebg-preview.png', import.meta.url).href,
    price: 65.0,
    rating: 4.9,
    reviews: 89,
    discount: 0,
    badge: "New",
    stock: 4,
    colors: []
  },
  {
    id: "p-003",
    name: "Calm Herbal Tea Blend",
    category: "Tea",
    image: new URL('../../public/asset/WhatsApp_Image_2026-05-04_at_14.29.51-removebg-preview.png', import.meta.url).href,
    price: 18.0,
    oldPrice: 22,
    rating: 4.5,
    reviews: 210,
    discount: 18,
    stock: 0,
    colors: []
  },
  {
    id: "p-004",
    name: "Radiance Face Oil Serum",
    category: "Skincare",
    image: new URL('../../public/asset/Huile de Visage (Produit).png', import.meta.url).href,
    price: 85.0,
    rating: 5.0,
    reviews: 42,
    discount: 0,
    stock: 25,
    colors: [
      { name: "Gold", value: "#E5A93A", image: new URL('../../public/asset/Huile de Visage (Produit).png', import.meta.url).href }
    ]
  }
];

export default function ProductGrid() {
  const handleAddToCart = async (product, selectedColor) => {
    console.log(`Added to cart: ${product.name}`, selectedColor ? `(Color: ${selectedColor.name})` : '');
    // In a real app, integrate with CartContext here
  };

  const handleWishlistToggle = (product) => {
    console.log(`Toggled wishlist for: ${product.name}`);
  };

  const handleQuickView = (product) => {
    console.log(`Quick viewing: ${product.name}`);
  };

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-white">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trending Now</h2>
          <p className="text-gray-500">Discover our most loved botanical essentials.</p>
        </div>
        <button className="hidden md:block text-sm font-semibold text-gray-900 border-b-2 border-gray-900 pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
          Shop All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {SAMPLE_PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onWishlistToggle={handleWishlistToggle}
            onQuickView={handleQuickView}
            currency="$"
          />
        ))}
      </div>
    </section>
  );
}
