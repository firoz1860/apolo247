'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, CheckCircle2, Loader2, ShoppingCart } from 'lucide-react';
import {
  cartTotal,
  readCart,
  writeCart,
  updateQuantity,
  removeFromCart,
  type CartItem,
} from '@/lib/cart';

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(readCart());
  }, []);

  const persist = (next: CartItem[]) => {
    setItems(next);
    writeCart(next);
  };

  const handleCheckout = async () => {
    setError(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('authtoken') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.error || 'Could not place order.');
      } else {
        persist([]);
        setPlaced(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (placed) {
    return (
      <div className="apollo-container py-20 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-green-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order placed!</h1>
        <p className="text-gray-600 mb-6">Your order has been placed successfully (mock payment).</p>
        <Link
          href="/pharmacy"
          className="inline-block bg-apollo-blue text-white px-5 py-2 rounded-md font-medium hover:bg-opacity-90"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="apollo-container py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <ShoppingCart className="h-6 w-6 mr-2 text-apollo-blue" />
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <p className="text-gray-600 mb-4">Your cart is empty.</p>
            <Link
              href="/pharmacy"
              className="inline-block bg-apollo-blue text-white px-5 py-2 rounded-md font-medium hover:bg-opacity-90"
            >
              Browse pharmacy
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm divide-y">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between p-4 gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-apollo-blue">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => persist(updateQuantity(items, item.productId, item.quantity - 1))}
                      className="p-1 border rounded hover:bg-gray-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => persist(updateQuantity(items, item.productId, item.quantity + 1))}
                      className="p-1 border rounded hover:bg-gray-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="w-16 text-right font-medium">₹{item.price * item.quantity}</div>
                  <button
                    onClick={() => persist(removeFromCart(items, item.productId))}
                    className="text-red-500 hover:text-red-600"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
              <div className="flex justify-between text-lg font-semibold mb-4">
                <span>Total</span>
                <span className="text-apollo-blue">₹{cartTotal(items)}</span>
              </div>
              {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
              <button
                onClick={handleCheckout}
                disabled={placing}
                className="w-full flex justify-center items-center bg-apollo-blue text-white py-2.5 rounded-md font-medium hover:bg-opacity-90 disabled:opacity-50"
              >
                {placing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Place order (mock payment)'}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
