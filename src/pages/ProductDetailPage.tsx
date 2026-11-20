import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import { getProductById } from '../services/productService';
import { PackVariant, Product } from '../types';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { usePageMeta } from '../hooks/usePageMeta';
import { ProductImage } from '../components/common/ProductImage';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [variant, setVariant] = useState<PackVariant>('standard');
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  usePageMeta({
    title: product ? product.name : 'Snack Details',
    description: product?.description,
  });

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse grid md:grid-cols-2 gap-10">
        <div className="aspect-[4/3] bg-millet-200 rounded-3xl" />
        <div className="space-y-4">
          <div className="h-5 w-40 bg-millet-200 rounded" />
          <div className="h-10 w-3/4 bg-millet-200 rounded-xl" />
          <div className="h-24 w-full bg-millet-200 rounded-xl" />
          <div className="h-14 w-48 bg-millet-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-3">Snack not found</h1>
        <Link to="/shop" className="text-forest-600 font-semibold hover:underline">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const activePrice = variant === 'standard' ? product.price : product.trialPrice;
  const images = product.images?.length ? product.images : [''];

  const handleAdd = () => {
    addToCart(product, variant, quantity);
    showToast(
      `Added ${quantity} × ${product.name} (${
        variant === 'standard' ? `${product.weightGrams}g` : `${product.trialWeightGrams}g Trial`
      }) to bag`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 sm:pb-12">
      <Link
        to="/shop"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-600 hover:text-saffron-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all snacks</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Sticky Image Gallery */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="rounded-[2rem] overflow-hidden bg-white border border-millet-200 shadow-soft aspect-[4/3]">
            <ProductImage
              src={images[activeImageIdx]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition cursor-pointer ${
                    activeImageIdx === idx ? 'border-forest-500' : 'border-transparent opacity-70'
                  }`}
                >
                  <ProductImage
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Module */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-millet-200 shadow-soft">
          <p className="text-xs sm:text-sm font-semibold text-forest-600 mb-2">
            {product.flavour} <span aria-hidden="true">·</span> {product.milletType}{' '}
            <span aria-hidden="true">·</span> Baked, Not Fried
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 mb-3">
            {product.name}
          </h1>
          <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Pack Selector */}
          <div className="mb-6">
            <label className="block text-xs font-bold tracking-wide text-charcoal-700 mb-2.5">
              Choose Pack Size
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVariant('standard')}
                className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer ${
                  variant === 'standard'
                    ? 'border-forest-500 bg-forest-50/60'
                    : 'border-millet-200 hover:border-millet-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-charcoal-900">
                    {product.weightGrams || 200}g Full Pack
                  </span>
                  {variant === 'standard' && <Check className="w-4 h-4 text-forest-600" />}
                </div>
                <p className="text-lg font-extrabold text-forest-600 mt-1 tabular-nums">
                  ₹{product.price}
                </p>
                <p className="text-xs text-charcoal-600">Everyday smart value</p>
              </button>

              <button
                type="button"
                onClick={() => setVariant('trial')}
                className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer ${
                  variant === 'trial'
                    ? 'border-saffron-500 bg-saffron-50/70'
                    : 'border-millet-200 hover:border-millet-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-charcoal-900">
                    {product.trialWeightGrams || 50}g Trial Pack
                  </span>
                  {variant === 'trial' && <Check className="w-4 h-4 text-saffron-600" />}
                </div>
                <p className="text-lg font-extrabold text-saffron-600 mt-1 tabular-nums">
                  ₹{product.trialPrice}
                </p>
                <p className="text-xs text-charcoal-600">Sample size to try crunch</p>
              </button>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="inline-flex items-center justify-between sm:justify-start rounded-2xl border border-millet-200 bg-millet-50 px-2 py-1.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 hover:text-forest-600 cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-bold text-base tabular-nums">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2.5 hover:text-forest-600 cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className="flex-1 py-4 px-6 rounded-2xl bg-forest-500 hover:bg-forest-600 disabled:bg-gray-300 text-white font-bold flex items-center justify-center gap-2 shadow-md transition active:scale-[0.99] tabular-nums cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>
                {product.stock <= 0
                  ? 'Out of Stock'
                  : `Add to Cart · ₹${activePrice * quantity}`}
              </span>
            </button>
          </div>

          {/* Ingredients */}
          <div className="pt-6 border-t border-millet-100 mb-6">
            <h2 className="text-sm font-bold text-charcoal-900 mb-2.5">
              Simple, Clean Ingredients
            </h2>
            <p className="text-sm text-charcoal-700 leading-relaxed">
              {product.ingredients?.join(' · ')}
            </p>
          </div>

          {/* Nutrition Table */}
          {product.nutrition && (
            <div className="pt-6 border-t border-millet-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-charcoal-900">Nutrition Facts</h2>
                <span className="text-xs text-charcoal-600">
                  Per {product.nutrition.servingSize || '100g'}
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-millet-200 text-sm">
                <table className="w-full tabular-nums">
                  <tbody className="divide-y divide-millet-100">
                    <tr className="bg-millet-50/70">
                      <td className="px-4 py-2.5 font-medium">Energy</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold">
                        {product.nutrition.energyKcal} kcal
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Protein</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold">
                        {product.nutrition.proteinG} g
                      </td>
                    </tr>
                    <tr className="bg-millet-50/70">
                      <td className="px-4 py-2.5 font-medium">Carbohydrates</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold">
                        {product.nutrition.carbsG} g
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-forest-600">Dietary Fiber</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-forest-600">
                        {product.nutrition.fiberG} g
                      </td>
                    </tr>
                    <tr className="bg-millet-50/70">
                      <td className="px-4 py-2.5 font-medium">Total Fat</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold">
                        {product.nutrition.fatG} g
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Saturated Fat</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold">
                        {product.nutrition.saturatedFatG} g
                      </td>
                    </tr>
                    <tr className="bg-millet-50/70">
                      <td className="px-4 py-2.5 font-medium">Sodium</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold">
                        {product.nutrition.sodiumMg} mg
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
