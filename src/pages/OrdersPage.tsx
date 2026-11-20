import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Clock } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { usePageMeta } from '../hooks/usePageMeta';
import { getUserOrders } from '../services/orderService';
import { Order, OrderStatus } from '../types';

const STATUS_STEPS: OrderStatus[] = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];

const formatDate = (ts?: Timestamp | Date | null): string => {
  if (!ts) return 'Just now';
  const date = ts instanceof Timestamp ? ts.toDate() : ts;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const OrdersPage: React.FC = () => {
  usePageMeta({ title: 'My Orders' });
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const list = await getUserOrders(user.uid);
        setOrders(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-charcoal-900 mb-2">My Orders</h1>
      <p className="text-sm text-charcoal-600 mb-8">
        Track your baked millet snack deliveries.
      </p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-white animate-pulse border border-millet-200" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-millet-200 shadow-soft">
          <Package className="w-12 h-12 text-forest-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-charcoal-900 mb-1">No orders yet</h2>
          <p className="text-sm text-charcoal-600 mb-6">
            Ready to try Masala Ragi Chips or Jowar Peri-Peri Puffs?
          </p>
          <Link
            to="/shop"
            className="inline-flex px-6 py-3 rounded-xl bg-forest-500 text-white font-semibold"
          >
            Start Snacking
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStepIdx = STATUS_STEPS.indexOf(order.status);
            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-millet-200 shadow-soft"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-millet-100">
                  <div>
                    <p className="text-xs text-charcoal-600 font-mono">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-charcoal-600 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5" /> {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-bold ${
                        order.status === 'Delivered'
                          ? 'text-forest-600'
                          : order.status === 'Cancelled'
                          ? 'text-red-600'
                          : 'text-saffron-600'
                      }`}
                    >
                      Status: {order.status}
                    </span>
                    <p className="text-base font-extrabold text-charcoal-900 mt-0.5 tabular-nums">
                      ₹{order.total}
                    </p>
                  </div>
                </div>

                {order.status !== 'Cancelled' && (
                  <div className="py-4 grid grid-cols-4 gap-2">
                    {STATUS_STEPS.map((step, idx) => {
                      const active = idx <= currentStepIdx;
                      return (
                        <div key={step} className="text-center">
                          <div
                            className={`h-2 rounded-full mb-1.5 ${
                              active ? 'bg-forest-500' : 'bg-millet-200'
                            }`}
                          />
                          <span
                            className={`text-xs font-semibold ${
                              active ? 'text-forest-700' : 'text-charcoal-600'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-2 py-3 border-t border-millet-100 tabular-nums">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-charcoal-800">
                        {item.name}{' '}
                        <span className="text-charcoal-600">
                          ({item.variantLabel}) × {item.quantity}
                        </span>
                      </span>
                      <span className="font-semibold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-millet-100 flex flex-wrap items-center justify-between gap-2 text-xs text-charcoal-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-forest-500" />
                    {order.address.addressLine}, {order.address.city} - {order.address.pincode}
                  </span>
                  <span>COD / Pay on UPI</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
