import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { FREE_SHIPPING_THRESHOLD } from '../../context/CartContext';
import { ProductImage } from '../common/ProductImage';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    subtotal,
    shippingFee,
    total,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();
  const navigate = useNavigate();

  const amountLeftForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-charcoal-900/40 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-millet-50 shadow-2xl flex flex-col"
          >
            <div className="px-6 py-4 bg-white border-b border-millet-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-forest-500" />
                <h2 className="text-lg font-bold text-charcoal-900">Your Snack Bag</h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-millet-100 text-charcoal-700 transition cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length > 0 && (
              <div className="px-6 py-3 bg-forest-50 border-b border-forest-100 text-xs font-medium text-forest-700 flex items-center gap-2 tabular-nums">
                <Truck className="w-4 h-4 shrink-0" />
                {amountLeftForFreeShipping > 0 ? (
                  <span>
                    Add <strong>₹{amountLeftForFreeShipping}</strong> more for{' '}
                    <strong>FREE delivery</strong>
                  </span>
                ) : (
                  <span>Free Pan-India delivery unlocked</span>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-millet-200/70 flex items-center justify-center text-forest-500 mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal-900 mb-1">Your bag is empty</h3>
                  <p className="text-sm text-charcoal-600 mb-6 max-w-xs">
                    Try our baked Ragi, Jowar, or Bajra crunch packs starting at ₹79 for a trial
                    pack.
                  </p>
                  <Link
                    to="/shop"
                    onClick={closeCart}
                    className="px-6 py-3 rounded-xl bg-forest-500 text-white text-sm font-semibold hover:bg-forest-600 transition"
                  >
                    Browse Snacks
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.productId}_${item.variant}`}
                    className="bg-white rounded-2xl p-3.5 border border-millet-200 shadow-sm flex gap-3.5"
                  >
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover bg-millet-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-charcoal-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-charcoal-600">
                            {item.flavour} · {item.variantLabel}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.variant)}
                          className="text-charcoal-600 hover:text-red-600 p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-xl border border-millet-200 bg-millet-50">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.variant, item.quantity - 1)
                            }
                            className="p-2 hover:text-forest-600 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-sm font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.variant, item.quantity + 1)
                            }
                            className="p-2 hover:text-forest-600 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="font-bold text-charcoal-900 tabular-nums">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-millet-200 space-y-3">
                <div className="flex justify-between text-sm text-charcoal-600 tabular-nums">
                  <span>Subtotal</span>
                  <span className="font-semibold text-charcoal-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-charcoal-600 tabular-nums">
                  <span>Delivery</span>
                  <span className="font-semibold text-forest-600">
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-charcoal-900 pt-2 border-t border-millet-100 tabular-nums">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md transition active:scale-[0.99] cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
