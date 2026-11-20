import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame,
  Wheat,
  ShieldCheck,
  IndianRupee,
  Ban,
  ArrowRight,
  Star,
  Check,
  Send,
} from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useAuth } from '../hooks/useAuth';
import { getFeaturedProducts, getAllProducts } from '../services/productService';
import { saveSubscriber } from '../services/contactService';
import { useToast } from '../hooks/useToast';
import { Product } from '../types';
import { ProductCard } from '../components/shop/ProductCard';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { ProductImage } from '../components/common/ProductImage';

const WHY_MILLETLY = [
  {
    icon: Flame,
    title: 'Baked, Never Fried',
    desc: 'Slow-baked crunch with up to 60% less oil than deep-fried potato chips.',
  },
  {
    icon: Wheat,
    title: 'Whole-Grain Millets',
    desc: 'Crafted from 60%+ real Ragi, Jowar & Bajra—not potato starch or fillers.',
  },
  {
    icon: Ban,
    title: 'Zero Maida',
    desc: 'Clean, honest grain blends that don’t leave you sluggish after 4 PM.',
  },
  {
    icon: ShieldCheck,
    title: 'No Preservatives',
    desc: 'Simple pantry spices & cold-pressed oils. Nothing unpronounceable.',
  },
  {
    icon: IndianRupee,
    title: 'Honest ₹250 Pricing',
    desc: 'Generous 200g shareable pack for ₹250—half the cost of boutique health brands.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Aarav Mehta',
    role: 'Product Designer · Gurugram',
    quote:
      'Switched my 4 PM office chips habit to Jowar Peri-Peri puffs—bold spice, light crunch, and zero greasy fingers on my keyboard.',
  },
  {
    name: 'Sneha Nair',
    role: 'MBA Student · Bengaluru',
    quote:
      'Quick-commerce healthy snacks cost ₹450+ for tiny bags. Paying ₹250 for a full 200g pack of Masala Ragi Chips actually fits a student budget.',
  },
  {
    name: 'Rohan Kulkarni',
    role: 'Software Engineer · Mumbai',
    quote:
      'Ordered the Bajra Cheese Crunch after requesting a trial sample. Clean ingredient list, crisp texture, and no palm oil aftertaste.',
  },
];

export const HomePage: React.FC = () => {
  usePageMeta({
    title: 'Milletly — Try a smarter snack today.',
    description:
      'Baked, not fried whole-grain millet snacks (Ragi, Jowar, Bajra) at INR 250 for 200g. No maida, no preservatives.',
  });

  const { isAdmin } = useAuth();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [subscriberInput, setSubscriberInput] = useState('');
  const [submittingLead, setSubmittingLead] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        let items = await getFeaturedProducts();
        if (items.length === 0) {
          items = (await getAllProducts()).slice(0, 3);
        }
        setFeatured(items.slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    load();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = subscriberInput.trim();
    if (cleaned.length < 4) {
      showToast('Please enter a valid email or 10-digit WhatsApp number.', 'error');
      return;
    }
    setSubmittingLead(true);
    try {
      const channel = cleaned.includes('@') ? 'email' : 'whatsapp';
      await saveSubscriber(cleaned, channel);
      setSubscriberInput('');
      showToast('You’re on the Milletly list! Watch out for fresh batch drops.');
    } catch {
      showToast('Could not save right now. Please try again.', 'error');
    } finally {
      setSubmittingLead(false);
    }
  };

  return (
    <div>
      {/* 1. HERO SPLIT */}
      <section className="pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <p className="text-xs sm:text-sm font-semibold text-forest-600 tracking-wide mb-4">
              Baked Whole-Grain Millets <span aria-hidden="true">·</span> 200g Pack at ₹250
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-charcoal-900 leading-[1.1] tracking-tight text-balance mb-5">
              Try a <span className="text-forest-500">smarter snack</span> today.
            </h1>
            <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed max-w-xl mb-8">
              Bold Indian flavours meets oven-baked Ragi, Jowar, and Bajra. Built for 4 PM cravings
              in Delhi NCR, Mumbai, and Bengaluru—without maida, deep-frying, or ₹500 luxury
              markups.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-forest-500 hover:bg-forest-600 text-white font-semibold shadow-card transition active:scale-95 whitespace-nowrap"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/trial"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-saffron-50 border border-saffron-500 text-saffron-600 font-semibold transition whitespace-nowrap"
              >
                <span>Request Free Trial</span>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-millet-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-charcoal-700">
              <span>100% Baked, Not Fried</span>
              <span aria-hidden="true">·</span>
              <span>No Maida or Palm Oil</span>
              <span aria-hidden="true">·</span>
              <span>COD / Pay on UPI</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="lg:col-span-6 relative rounded-[2rem] overflow-hidden shadow-card border border-millet-200 min-h-[320px] lg:h-full bg-millet-200"
          >
            <ProductImage
              src="/src/assets/images/hero_milletly_snacks_1795195409253.jpg"
              alt="Bowls of baked Milletly ragi chips, jowar puffs, and bajra crunch on sandstone"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
              <div>
                <p className="text-xs font-semibold text-saffron-400">Everyday Smart Pack</p>
                <p className="text-lg sm:text-xl font-bold">200g Shareable & Desk Pack</p>
              </div>
              <div className="text-right tabular-nums shrink-0">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">₹250</span>
                <span className="block text-xs text-millet-200">Trial packs ₹79</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS (DYNAMIC FROM FIRESTORE) */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-forest-600 tracking-wide">
              Fresh From The Oven
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-1">
              Signature Baked Millet Snacks
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-forest-600 hover:text-saffron-600 transition whitespace-nowrap"
          >
            <span>View all snacks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : featured.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-millet-200 shadow-soft">
            <h3 className="text-lg font-bold text-charcoal-900 mb-2">
              Snack catalog is waiting to be seeded
            </h3>
            <p className="text-sm text-charcoal-600 mb-5 max-w-md mx-auto">
              Products are loaded live from Cloud Firestore. Sign in as an admin to seed the 3
              sample baked millet products in one click.
            </p>
            <Link
              to={isAdmin ? '/admin' : '/login'}
              className="inline-flex px-6 py-3 rounded-xl bg-forest-500 hover:bg-forest-600 text-white text-sm font-semibold transition"
            >
              {isAdmin ? 'Open Admin & Seed Data' : 'Admin Sign In'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 3. WHY MILLETLY + PRICE POSITIONING */}
      <section className="py-16 bg-white border-y border-millet-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div>
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-semibold text-saffron-600 tracking-wide">
                The Milletly Promise
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-1 text-balance">
                Why urban snackers are switching from fried chips
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {WHY_MILLETLY.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-millet-50 rounded-3xl p-6 border border-millet-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-forest-500 text-white flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-charcoal-900 mb-1.5">{item.title}</h3>
                    <p className="text-sm text-charcoal-600 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Positioning */}
          <div className="bg-forest-600 text-white rounded-[2rem] p-6 sm:p-10 lg:p-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-xs font-semibold text-saffron-400 tracking-wide">
                Smart Mid-Range Positioning
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 text-balance">
                Why pay ₹500+ just to avoid deep-fried maida?
              </h2>
              <p className="text-millet-200 mt-2.5 text-sm sm:text-base">
                Milletly sits right in the sweet spot: whole-grain nutrition at a weekly snacking
                price.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              <div className="rounded-3xl p-6 bg-white/10 border border-white/15 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-millet-200">Conventional Chips</p>
                  <p className="text-2xl font-extrabold mt-1 tabular-nums">₹20 – ₹60</p>
                  <p className="text-xs text-millet-200 mt-1">Cheap, everywhere, empty calories</p>
                  <ul className="mt-5 space-y-2 text-sm text-millet-100/90">
                    <li>Deep-fried in palm oil</li>
                    <li>Refined flour / high sodium</li>
                    <li>Minimal fiber or protein</li>
                  </ul>
                </div>
                <p className="mt-6 pt-4 border-t border-white/10 text-xs text-millet-200">
                  Low Cost · Low Nutrition
                </p>
              </div>

              <div className="rounded-3xl p-7 bg-millet-100 text-charcoal-900 shadow-2xl border-2 border-saffron-500 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-saffron-600">
                    The Sweet Spot · Milletly (200g)
                  </p>
                  <p className="text-3xl font-extrabold text-forest-600 mt-1 tabular-nums">₹250</p>
                  <p className="text-xs text-charcoal-600 mt-1">
                    Honest mid-range price for daily snacking
                  </p>
                  <ul className="mt-5 space-y-2.5 text-sm font-medium text-charcoal-800">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-forest-500 shrink-0" />
                      <span>60%+ Whole-grain Ragi, Jowar & Bajra</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-forest-500 shrink-0" />
                      <span>100% Baked, Cold-Pressed Oil, Zero Maida</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-forest-500 shrink-0" />
                      <span>Bold Desi Masala, Peri-Peri & Cheese</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/shop"
                  className="mt-6 w-full py-3 rounded-xl bg-forest-500 hover:bg-forest-600 text-white text-center text-sm font-bold transition"
                >
                  Order 200g Pack
                </Link>
              </div>

              <div className="rounded-3xl p-6 bg-white/10 border border-white/15 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-millet-200">Boutique Health Brands</p>
                  <p className="text-2xl font-extrabold mt-1 tabular-nums">₹450 – ₹750</p>
                  <p className="text-xs text-millet-200 mt-1">Healthy, but luxury-priced</p>
                  <ul className="mt-5 space-y-2 text-sm text-millet-100/90">
                    <li>Clean baked ingredients</li>
                    <li>Tiny 70g–100g pouches</li>
                    <li>Hard to sustain every week</li>
                  </ul>
                </div>
                <p className="mt-6 pt-4 border-t border-white/10 text-xs text-millet-200">
                  High Cost · Good Nutrition
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT ARE MILLETS + TESTIMONIALS + INSIDER SIGNUP */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="bg-white rounded-[2rem] p-8 sm:p-12 border border-millet-200 shadow-soft grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-semibold text-saffron-600 tracking-wide">
              India’s Supergrains (Shree Anna)
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-1.5 mb-4 text-balance">
              What are millets—and why do they snack better?
            </h2>
            <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed mb-6">
              Millets like <strong>Ragi</strong> (Finger Millet), <strong>Jowar</strong> (Sorghum),
              and <strong>Bajra</strong> (Pearl Millet) have fuelled Indian kitchens for generations.
              Unlike refined wheat (maida) or starchy potatoes, millets digest steadily, carry
              natural dietary fiber and iron, and use 70% less water to cultivate.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 font-bold text-forest-600 hover:text-saffron-600 text-sm transition"
            >
              <span>Read our story & millet mission</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-millet-50 p-5 border border-millet-200">
              <h3 className="font-extrabold text-forest-600 text-lg">Ragi</h3>
              <p className="text-xs text-charcoal-600 font-medium mb-2">Finger Millet</p>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Rich in natural calcium & amino acids. Gives chips an earthy, crisp snap.
              </p>
            </div>
            <div className="rounded-2xl bg-millet-50 p-5 border border-millet-200">
              <h3 className="font-extrabold text-forest-600 text-lg">Jowar</h3>
              <p className="text-xs text-charcoal-600 font-medium mb-2">Sorghum</p>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Naturally gluten-free & light—ideal for airy, crispy oven-baked puffs.
              </p>
            </div>
            <div className="rounded-2xl bg-millet-50 p-5 border border-millet-200">
              <h3 className="font-extrabold text-forest-600 text-lg">Bajra</h3>
              <p className="text-xs text-charcoal-600 font-medium mb-2">Pearl Millet</p>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                High in iron, magnesium & steady energy for busy workdays.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-xs font-semibold text-forest-600">
              Delhi NCR · Mumbai · Bengaluru
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-1">
              Loved by smart snackers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-3xl p-6 border border-millet-200 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-saffron-500 mb-3" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-charcoal-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                </div>
                <div className="mt-5 pt-4 border-t border-millet-100">
                  <p className="font-bold text-sm text-charcoal-900">{t.name}</p>
                  <p className="text-xs text-charcoal-600">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter / WhatsApp */}
        <div className="bg-saffron-500 rounded-[2rem] p-8 sm:p-12 text-white text-center shadow-card max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-balance">
            Get first access to new flavours & trial drops
          </h2>
          <p className="text-sm sm:text-base text-white/95 max-w-lg mx-auto mb-6">
            Drop your email or WhatsApp number. No spam—just fresh baked batches and community
            tasting invites.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="text"
              value={subscriberInput}
              onChange={(e) => setSubscriberInput(e.target.value)}
              placeholder="Email or 10-digit WhatsApp number"
              required
              className="flex-1 px-4 py-3.5 rounded-xl text-charcoal-900 bg-white placeholder:text-charcoal-600/70 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
            />
            <button
              type="submit"
              disabled={submittingLead}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-charcoal-900 hover:bg-forest-700 text-white font-semibold text-sm transition disabled:opacity-60 whitespace-nowrap cursor-pointer"
            >
              <span>{submittingLead ? 'Joining...' : 'Join List'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
