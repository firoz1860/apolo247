import { describe, it, expect } from 'vitest';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  cartTotal,
  cartCount,
  type CartItem,
} from '@/lib/cart';

const item = (id: string, price: number, quantity = 1): CartItem => ({
  productId: id,
  name: `Item ${id}`,
  price,
  quantity,
});

describe('cart', () => {
  it('adds a new item', () => {
    const cart = addToCart([], item('a', 100));
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(1);
  });

  it('increments quantity when adding an existing item', () => {
    let cart = addToCart([], item('a', 100));
    cart = addToCart(cart, item('a', 100));
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  it('updates quantity', () => {
    const cart = updateQuantity([item('a', 100, 1)], 'a', 5);
    expect(cart[0].quantity).toBe(5);
  });

  it('removes an item when quantity drops to zero', () => {
    const cart = updateQuantity([item('a', 100, 1)], 'a', 0);
    expect(cart).toHaveLength(0);
  });

  it('removes an item explicitly', () => {
    const cart = removeFromCart([item('a', 100), item('b', 50)], 'a');
    expect(cart.map((i) => i.productId)).toEqual(['b']);
  });

  it('computes count and total', () => {
    const cart = [item('a', 100, 2), item('b', 50, 3)];
    expect(cartCount(cart)).toBe(5);
    expect(cartTotal(cart)).toBe(100 * 2 + 50 * 3);
  });

  it('does not mutate the input array', () => {
    const original = [item('a', 100, 1)];
    addToCart(original, item('a', 100));
    expect(original[0].quantity).toBe(1);
  });
});
