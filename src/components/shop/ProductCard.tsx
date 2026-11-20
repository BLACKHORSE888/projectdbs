import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { ProductImage } from '../common/ProductImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 'standard', 1);
    showToast(`${product.name} added to bag`);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="group bg-white rounded-3xl p-4 border border-millet-200/80 shadow-soft hover:shadow-card flex flex-col justify-between transition-shadow"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-millet-50 aspect-[4/3] mb-4">
          <ProductImage
            src={product.images?.[0]}
            alt={`${product.name} baked ${product.milletType} snack`}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-charcoal-900/55 flex items-center justify-center">
              <span className="text-white text-xs font-bold tracking-wider uppercase">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 text-xs text-charcoal-600 mb-1.5">
          <span className="truncate font-medium text-forest-600">
            {product.flavour} <span aria-hidden="true">·</span> {product.milletType}
          </span>
          {product.featured && (
            <span className="text-[11px] font-semibold text-saffron-600 shrink-0">
              Bestseller
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-charcoal-900 group-hover:text-forest-600 transition-colors mb-1.5">
          {product.name}
        </h3>
        <p className="text-sm text-charcoal-600 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>
      </Link>

      <div className="flex items-center justify-between pt-3 border-t border-millet-100">
        <div>
          <div className="flex items-baseline gap-1.5 tabular-nums">
            <span className="text-xl font-extrabold text-charcoal-900">₹{product.price}</span>
            <span className="text-xs text-charcoal-600">/ {product.weightGrams || 200}g</span>
          </div>
          <p className="text-xs text-charcoal-600 tabular-nums">
            Trial pack ₹{product.trialPrice}
          </p>
        </div>

        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={product.stock <= 0}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-500 hover:bg-forest-600 disabled:bg-gray-300 text-white text-sm font-semibold transition active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>
    </motion.div>
  );
};
