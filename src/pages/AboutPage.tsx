import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, HeartHandshake, Globe2, ArrowRight } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export const AboutPage: React.FC = () => {
  usePageMeta({
    title: 'Our Story & Millet Mission',
    description:
      'How Milletly is making baked, nutritious Indian millet snacks affordable for young urban India.',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-semibold text-saffron-600 tracking-wide">Our Story</p>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal-900 mt-2 mb-5 leading-tight text-balance">
          Healthy Indian snacking shouldn’t cost a luxury tax.
        </h1>
        <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed">
          Look around any metro in India—Delhi NCR, Mumbai, or Bengaluru. At 4 PM, your choices are
          either ₹20 fried maida snacks or ₹500 imported-looking &ldquo;superfood&rdquo; packs. We
          started <strong>Milletly</strong> to fix that gap: delicious, baked millet snacks priced at
          ₹250 for a generous 200g pack.
        </p>
      </section>

      <section className="bg-white rounded-[2rem] p-8 sm:p-12 border border-millet-200 shadow-soft grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold text-forest-600 mb-3">
            <Globe2 className="w-4 h-4" />
            <span>Inspired by the International Year of Millets</span>
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mb-3">
            Bringing Shree Anna back to your desk
          </h2>
          <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed mb-4">
            Following the UN & India’s <strong>International Year of Millets</strong> movement,
            ancient climate-resilient grains like Ragi, Jowar, and Bajra are finally getting the
            spotlight they deserve. They thrive in dry Indian soils, use a fraction of the water
            rice or wheat needs, and pack genuine fiber and micronutrients.
          </p>
          <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed">
            Our mission is simple: turn these powerhouse grains into crunchy, street-style Indian
            snacks that college students and young professionals actually look forward to eating.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="p-5 rounded-2xl bg-millet-50 border border-millet-200 flex gap-4">
            <Sprout className="w-7 h-7 text-forest-500 shrink-0" />
            <div>
              <h3 className="font-bold text-charcoal-900">100% Baked Process</h3>
              <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
                Hot-air roasted & slow-baked with minimal cold-pressed oil so you get the crunch
                without soggy fingers.
              </p>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-millet-50 border border-millet-200 flex gap-4">
            <HeartHandshake className="w-7 h-7 text-saffron-500 shrink-0" />
            <div>
              <h3 className="font-bold text-charcoal-900">Farmer-Forward Sourcing</h3>
              <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
                Every pack supports Indian millet farmers across Karnataka, Maharashtra, and
                Rajasthan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-forest-600 rounded-[2rem] p-8 sm:p-12 text-center text-white">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Taste the difference yourself</h2>
        <p className="text-millet-200 max-w-lg mx-auto mb-6 text-sm sm:text-base">
          Grab a 200g pack for ₹250 or request a free 50g trial pack as part of our community
          launch.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-sm transition"
          >
            <span>Shop Snacks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/trial"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-forest-700 font-bold text-sm transition hover:bg-millet-100"
          >
            <span>Request Free Trial</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
