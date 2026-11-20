import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Wallet } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { usePageMeta } from '../hooks/usePageMeta';
import { createOrder } from '../services/orderService';
import { processOrderPayment } from '../services/paymentService';
import { updateUserProfile } from '../services/userService';
import { ProductImage } from '../components/common/ProductImage';

export const CheckoutPage: React.FC = () => {
  usePageMeta({ title: 'Checkout' });

  const { user, userProfile, refreshProfile } = useAuth();
  const { items, subtotal, shippingFee, total, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName((prev) => prev || userProfile.name || '');
      setPhone((prev) => prev || userProfile.phone || '');
      setAddressLine((prev) => prev || userProfile.address || '');
      setCity((prev) => prev || userProfile.city || '');
      setPincode((prev) => prev || userProfile.pincode || '');
    } else if (user) {
      setName((prev) => prev || user.displayName || '');
    }
  }, [user, userProfile]);

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-8 border border-millet-200 shadow-soft">
          <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Your cart is empty</h1>
          <p className="text-sm text-charcoal-600 mb-6">
            Add some baked Ragi, Jowar, or Bajra crunch before checking out.
          </p>
          <Link
            to="/shop"
            className="inline-flex px-6 py-3 rounded-xl bg-forest-500 text-white font-semibold"
          >
            Explore Snacks
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      showToast('Please enter a valid 10-digit Indian mobile number.', 'error');
      return;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      showToast('Please enter a valid 6-digit Indian pincode.', 'error');
      return;
    }

    setPlacing(true);
    try {
      const paymentResult = await processOrderPayment({
        amountInr: total,
        method: 'COD_UPI_CONFIRM',
        customerName: name.trim(),
        customerEmail: user.email || '',
        customerPhone: phone.trim(),
      });

      await createOrder({
        userId: user.uid,
        userEmail: user.email || '',
        items,
        subtotal,
        shippingFee,
        total,
        address: {
          name: name.trim(),
          phone: phone.trim(),
          addressLine: addressLine.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
        },
        paymentMethod: paymentResult.paymentMethod,
        paymentStatus: paymentResult.paymentStatus,
      });

      await updateUserProfile(user.uid, {
        name: name.trim(),
        phone: phone.trim(),
        address: addressLine.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
      });
      await refreshProfile();

      await clearCart();
      showToast('Order placed! We will confirm shortly.');
      navigate('/orders');
    } catch (err) {
      console.error(err);
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-charcoal-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-millet-200 shadow-soft space-y-5"
        >
          <h2 className="text-xl font-bold text-charcoal-900">Delivery Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Mobile Number (10 digits)
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
              Full Delivery Address
            </label>
            <textarea
              rows={3}
              required
              minLength={5}
              maxLength={300}
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder="Flat / House No., Building, Street, Landmark"
              className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">City</label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={80}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bengaluru / Mumbai / Delhi NCR"
                className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">Pincode</label>
              <input
                type="text"
                required
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="560001"
                className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-millet-100">
            <h2 className="text-lg font-bold text-charcoal-900 mb-3">Payment Method</h2>
            <div className="p-4 rounded-2xl border-2 border-forest-500 bg-forest-50/70 flex items-start gap-3">
              <Wallet className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-charcoal-900">
                    Cash on Delivery / Pay on UPI after confirmation
                  </p>
                  <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                </div>
                <p className="text-xs text-charcoal-600 mt-1">
                  Pay zero upfront today. Once we confirm your batch on WhatsApp, pay via UPI or
                  cash on delivery. (Razorpay integration ready in paymentService.ts)
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={placing}
            className="w-full py-4 rounded-2xl bg-forest-500 hover:bg-forest-600 text-white font-bold text-base shadow-md transition disabled:opacity-60 tabular-nums cursor-pointer"
          >
            {placing ? 'Placing Order...' : `Place Order · ₹${total}`}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-charcoal-600">
            <ShieldCheck className="w-4 h-4 text-forest-500" />
            <span>Freshly packed & dispatched within 24 hours</span>
          </p>
        </form>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-millet-200 shadow-soft sticky top-24">
            <h2 className="text-xl font-bold text-charcoal-900 mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={`${item.productId}_${item.variant}`}
                  className="flex items-center gap-3 pb-3 border-b border-millet-100"
                >
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-millet-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-charcoal-900 truncate">{item.name}</p>
                    <p className="text-xs text-charcoal-600">
                      {item.variantLabel} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-sm text-charcoal-900 tabular-nums">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 text-sm tabular-nums">
              <div className="flex justify-between text-charcoal-600">
                <span>Subtotal</span>
                <span className="font-semibold text-charcoal-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>Shipping</span>
                <span className="font-semibold text-forest-600">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-charcoal-900 pt-3 border-t border-millet-200">
                <span>Total Payable</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
