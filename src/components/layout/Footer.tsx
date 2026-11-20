import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Instagram, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-900 text-millet-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-forest-500 flex items-center justify-center text-millet-100">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-white">Milletly</span>
          </Link>
          <p className="text-sm text-millet-200/80 leading-relaxed mb-4">
            Try a smarter snack today. Whole-grain, oven-baked millet snacks crafted for urban
            India—without maida or boutique price tags.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/milletly.in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Milletly Instagram"
              className="p-2.5 rounded-xl bg-white/10 hover:bg-saffron-500 text-white transition"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="mailto:hello@milletly.in"
              aria-label="Email Milletly"
              className="p-2.5 rounded-xl bg-white/10 hover:bg-saffron-500 text-white transition"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 text-sm tracking-wide">Snack & Try</h4>
          <ul className="space-y-2.5 text-sm text-millet-200/80">
            <li>
              <Link to="/shop" className="hover:text-saffron-400 transition">
                Shop All Snacks
              </Link>
            </li>
            <li>
              <Link to="/trial" className="hover:text-saffron-400 transition">
                Request Free Trial Pack
              </Link>
            </li>
            <li>
              <Link to="/survey" className="hover:text-saffron-400 transition">
                Take Taste Survey
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-saffron-400 transition">
                Track My Orders
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 text-sm tracking-wide">Company</h4>
          <ul className="space-y-2.5 text-sm text-millet-200/80">
            <li>
              <Link to="/about" className="hover:text-saffron-400 transition">
                Our Story & Millets
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-saffron-400 transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/policies#shipping" className="hover:text-saffron-400 transition">
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link to="/policies#privacy" className="hover:text-saffron-400 transition">
                Privacy & Terms
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 text-sm tracking-wide">Delivering Across</h4>
          <p className="flex items-start gap-2 text-sm text-millet-200/80 mb-3">
            <MapPin className="w-4 h-4 text-saffron-400 shrink-0 mt-0.5" />
            <span>Delhi NCR, Mumbai, Bengaluru & Pan-India D2C shipping</span>
          </p>
          <p className="text-sm text-millet-200/80">
            Support:{' '}
            <a href="mailto:hello@milletly.in" className="text-saffron-400 hover:underline">
              hello@milletly.in
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 px-4 text-center text-xs text-millet-200/60">
        © {new Date().getFullYear()} Milletly Foods India. Made with Ragi, Jowar & Bajra.
      </div>
    </footer>
  );
};
