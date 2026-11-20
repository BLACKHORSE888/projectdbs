import React from 'react';
import { usePageMeta } from '../hooks/usePageMeta';

export const PoliciesPage: React.FC = () => {
  usePageMeta({
    title: 'Shipping, Returns & Privacy Policies',
    description: 'Milletly D2C shipping timelines, returns policy, and customer data privacy.',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <h1 className="text-3xl font-extrabold text-charcoal-900">Milletly Policies</h1>

      <section
        id="shipping"
        className="bg-white rounded-3xl p-7 border border-millet-200 shadow-soft space-y-3"
      >
        <h2 className="text-xl font-bold text-charcoal-900">Shipping & Delivery</h2>
        <p className="text-sm text-charcoal-600 leading-relaxed">
          Orders placed before 2 PM IST are freshly packed and dispatched within 24 business hours.
          Delivery takes 2–4 days in Delhi NCR, Mumbai, and Bengaluru, and 4–6 days across the rest
          of India. Free delivery applies automatically on orders of ₹499 and above.
        </p>
      </section>

      <section className="bg-white rounded-3xl p-7 border border-millet-200 shadow-soft space-y-3">
        <h2 className="text-xl font-bold text-charcoal-900">Returns & Damaged Packs</h2>
        <p className="text-sm text-charcoal-600 leading-relaxed">
          Since Milletly snacks are perishable food products, we do not accept returns once opened.
          However, if your pack arrives damaged or stale, email{' '}
          <a href="mailto:hello@milletly.in" className="text-forest-600 font-semibold underline">
            hello@milletly.in
          </a>{' '}
          within 48 hours with a photo and we will issue a free replacement or full refund.
        </p>
      </section>

      <section
        id="privacy"
        className="bg-white rounded-3xl p-7 border border-millet-200 shadow-soft space-y-3"
      >
        <h2 className="text-xl font-bold text-charcoal-900">Privacy & Google Sign-In</h2>
        <p className="text-sm text-charcoal-600 leading-relaxed">
          We use Google Sign-In via Firebase Authentication strictly to identify your account, store
          your delivery preferences, and display your order history. We never sell or rent your phone
          number, email, or address to third-party marketers.
        </p>
      </section>
    </div>
  );
};
