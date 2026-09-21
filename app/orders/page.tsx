'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, FlaskConical, Loader2, ShoppingBag } from 'lucide-react';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}
interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}
interface LabBooking {
  _id: string;
  testName: string;
  price: number;
  date: string;
  status: string;
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    placed: 'bg-blue-50 text-apollo-blue',
    booked: 'bg-blue-50 text-apollo-blue',
    delivered: 'bg-green-50 text-green-700',
    completed: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-600',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [labBookings, setLabBookings] = useState<LabBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const getToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('authtoken') : null;

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setNeedsLogin(true);
      setLoading(false);
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [ordersRes, labRes] = await Promise.all([
        fetch('/api/orders', { headers }),
        fetch('/api/lab-bookings', { headers }),
      ]);
      if (ordersRes.status === 401 || labRes.status === 401) {
        setNeedsLogin(true);
        return;
      }
      const ordersData = await ordersRes.json();
      const labData = await labRes.json();
      if (ordersData.success) setOrders(ordersData.data);
      if (labData.success) setLabBookings(labData.data);
      if (!ordersData.success && !labData.success) {
        setError('Failed to load your orders.');
      }
    } catch {
      setError('Failed to load your orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cancel = async (url: string, id: string) => {
    const token = getToken();
    if (!token) return;
    setCancelling(id);
    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'cancel' }),
      });
      if (res.ok) await load();
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="apollo-container py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-apollo-blue" />
      </div>
    );
  }

  if (needsLogin) {
    return (
      <div className="apollo-container py-16 text-center">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Please sign in</h1>
        <p className="text-gray-600 mb-4">Log in to view your orders and bookings.</p>
        <Link
          href="/login"
          className="inline-block bg-apollo-blue text-white px-5 py-2 rounded-md font-medium hover:bg-opacity-90"
        >
          Go to login
        </Link>
      </div>
    );
  }

  const nothing = orders.length === 0 && labBookings.length === 0;

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="apollo-container py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <ShoppingBag className="h-6 w-6 mr-2 text-apollo-blue" />
          My Orders &amp; Bookings
        </h1>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>}

        {nothing ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-600 mb-4">You have no orders or lab bookings yet.</p>
            <div className="flex justify-center gap-3">
              <Link href="/pharmacy" className="bg-apollo-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90">
                Shop pharmacy
              </Link>
              <Link href="/lab-tests" className="border border-apollo-blue text-apollo-blue px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50">
                Book a test
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.length > 0 && (
              <section>
                <h2 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-apollo-blue" /> Pharmacy orders
                </h2>
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-lg shadow-sm p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {order.items.map((item, i) => (
                          <li key={i} className="flex justify-between">
                            <span>{item.name} × {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t mt-2 pt-2 flex justify-between items-center">
                        <span className="font-medium">Total: <span className="text-apollo-blue">₹{order.totalAmount}</span></span>
                        {order.status === 'placed' && (
                          <button
                            onClick={() => cancel(`/api/orders/${order._id}`, order._id)}
                            disabled={cancelling === order._id}
                            className="text-sm px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {cancelling === order._id ? 'Cancelling…' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {labBookings.length > 0 && (
              <section>
                <h2 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <FlaskConical className="h-5 w-5 mr-2 text-apollo-blue" /> Lab bookings
                </h2>
                <div className="space-y-3">
                  {labBookings.map((booking) => (
                    <div key={booking._id} className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center gap-4">
                      <div>
                        <p className="font-medium text-gray-800">{booking.testName}</p>
                        <p className="text-xs text-gray-500">Collection: {booking.date}</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusBadge(booking.status)}`}>
                            {booking.status}
                          </span>
                          <p className="text-sm font-medium text-apollo-blue mt-1">₹{booking.price}</p>
                        </div>
                        {booking.status === 'booked' && (
                          <button
                            onClick={() => cancel(`/api/lab-bookings/${booking._id}`, booking._id)}
                            disabled={cancelling === booking._id}
                            className="text-sm px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {cancelling === booking._id ? '…' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
