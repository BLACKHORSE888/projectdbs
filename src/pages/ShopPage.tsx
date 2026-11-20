import React, { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { getAllProducts } from '../services/productService';
import { Product } from '../types';
import { ProductCard } from '../components/shop/ProductCard';
import { SkeletonCard } from '../components/common/SkeletonCard';

type SortOption = 'featured' | 'price-asc' | 'price-desc';

export const ShopPage: React.FC = () => {
  usePageMeta({
    title: 'Shop Baked Millet Snacks',
    description: 'Browse baked Ragi, Jowar, and Bajra snacks at INR 250 for 200g or INR 79 trial packs.',
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedFlavour, setSelectedFlavour] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getAllProducts();
        setProducts(list);
      } catch (err) {
        console.error(err);
        setError('Unable to load snacks right now. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const flavours = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.flavour).filter(Boolean)));
    return ['All', ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedFlavour !== 'All') {
      list = list.filter((p) => p.flavour === selectedFlavour);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.flavour.toLowerCase().includes(q) ||
          p.milletType.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else {
      list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return list;
  }, [products, selectedFlavour, search, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-8">
        <p className="text-xs font-semibold text-saffron-600 tracking-wide">
          Baked · Whole Grain · Zero Maida
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 mt-1">
          Shop Milletly Snacks
        </h1>
        <p className="text-charcoal-600 mt-2 text-sm sm:text-base">
          Full 200g packs at ₹250, or start small with a 50g trial pack.
        </p>
      </div>

      {/* Filters & Sorting */}
      <div className="bg-white rounded-2xl p-4 border border-millet-200 shadow-sm mb-8 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-charcoal-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Ragi, Peri-Peri, Cheese..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-millet-50 rounded-xl">
          {flavours.map((flavour) => (
            <button
              key={flavour}
              type="button"
              onClick={() => setSelectedFlavour(flavour)}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
                selectedFlavour === flavour
                  ? 'bg-forest-500 text-white shadow-sm'
                  : 'text-charcoal-700 hover:text-charcoal-900'
              }`}
            >
              {flavour}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-charcoal-600" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort products"
            className="px-3 py-2 rounded-xl bg-millet-50 border border-millet-200 text-sm font-medium focus:outline-none focus:border-forest-500 cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center">
          {error}
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-millet-200">
          <h3 className="text-lg font-bold text-charcoal-900 mb-1">No matching snacks found</h3>
          <p className="text-sm text-charcoal-600">
            Try clearing your search or selecting another flavour filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
