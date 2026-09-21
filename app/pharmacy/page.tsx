'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Pill, Loader2, Plus } from 'lucide-react';
import {
  addToCart,
  cartCount,
  readCart,
  writeCart,
  type CartItem,
} from '@/lib/cart';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  manufacturer?: string;
  prescriptionRequired: boolean;
}

const CATEGORIES = [
  'All',
  'Pain Relief',
  'Vitamins',
  'Cold & Cough',
  'Digestive',
  'Skin Care',
  'Diabetes',
];

export default function PharmacyPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [count, setCount] = useState(0);
  const [added, setAdded] = useState<string | null>(null);

  useEffect(() => {
    setCount(cartCount(readCart()));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category !== 'All') params.set('category', category);
      const res = await fetch(`/api/products?${params.toString()}`);
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.error || 'Failed to load products.');
        setProducts([]);
      } else {
        setProducts(result.data);
      }
    } catch {
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    const t = setTimeout(load, 250); // debounce search
    return () => clearTimeout(t);
  }, [load]);

  const handleAdd = (product: Product) => {
    const item: CartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
    };
    const next = addToCart(readCart(), item);
    writeCart(next);
    setCount(cartCount(next));
    setAdded(product._id);
    setTimeout(() => setAdded((cur) => (cur === product._id ? null : cur)), 1000);
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="bg-apollo-blue py-8">
        <div className="apollo-container flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl md:text-3xl font-bold mb-1">Pharmacy</h1>
            <p className="text-white/90 text-sm">Order genuine medicines and health products</p>
          </div>
          <Link
            href="/pharmacy/cart"
            className="relative flex items-center gap-2 bg-white text-apollo-blue px-4 py-2 rounded-md font-medium"
          >
            <ShoppingCart className="h-5 w-5" />
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-apollo-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </section>

      <div className="apollo-container py-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicines…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                category === cat
                  ? 'bg-apollo-blue text-white border-apollo-blue'
                  : 'border-gray-300 text-gray-700 hover:border-apollo-blue'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-apollo-blue" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        ) : products.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <Pill className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-600">No products found. Try a different search.</p>
            <p className="text-gray-400 text-sm mt-1">Tip: run <code>npm run seed:pharmacy</code> to add sample products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
                <div className="bg-blue-50 rounded-md h-24 flex items-center justify-center mb-3">
                  <Pill className="h-10 w-10 text-apollo-blue" />
                </div>
                <h3 className="font-medium text-gray-800 text-sm line-clamp-2">{product.name}</h3>
                {product.manufacturer && (
                  <p className="text-xs text-gray-500 mb-1">{product.manufacturer}</p>
                )}
                {product.prescriptionRequired && (
                  <span className="text-[10px] text-red-500 font-medium mb-1">Rx required</span>
                )}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div>
                    <span className="font-semibold text-apollo-blue">₹{product.price}</span>
                    {product.mrp > product.price && (
                      <span className="text-xs text-gray-400 line-through ml-1">₹{product.mrp}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAdd(product)}
                    className="flex items-center gap-1 text-xs bg-apollo-blue text-white px-2 py-1.5 rounded hover:bg-opacity-90"
                  >
                    {added === product._id ? 'Added' : <><Plus className="h-3 w-3" /> Add</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
