import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Database,
  ShoppingBag,
  IndianRupee,
  PackageCheck,
  Sparkles,
  ClipboardList,
  X,
} from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useToast } from '../hooks/useToast';
import { seedSampleProducts } from '../lib/seedData';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';
import { getAllOrders, updateOrderStatus } from '../services/orderService';
import { getAllTrialRequests, updateTrialRequestStatus } from '../services/trialService';
import { getAllSurveys } from '../services/surveyService';
import { getAllContactMessages } from '../services/contactService';
import {
  ContactMessage,
  Order,
  OrderStatus,
  Product,
  SurveyResponse,
  TrialRequest,
  TrialRequestStatus,
} from '../types';
import { ProductImage } from '../components/common/ProductImage';

type AdminTab = 'products' | 'orders' | 'trials' | 'surveys' | 'messages';

interface ProductFormState {
  name: string;
  description: string;
  flavour: string;
  milletType: string;
  price: number;
  trialPrice: number;
  weightGrams: number;
  trialWeightGrams: number;
  imageUrls: string;
  ingredientsText: string;
  energyKcal: number;
  proteinG: number;
  carbsG: number;
  fiberG: number;
  fatG: number;
  saturatedFatG: number;
  sodiumMg: number;
  stock: number;
  featured: boolean;
}

const EMPTY_FORM: ProductFormState = {
  name: '',
  description: '',
  flavour: 'Desi Masala',
  milletType: 'Ragi (Finger Millet)',
  price: 250,
  trialPrice: 79,
  weightGrams: 200,
  trialWeightGrams: 50,
  imageUrls: '/src/assets/images/product_ragi_chips_1795195409071.jpg',
  ingredientsText: 'Whole-grain Millet Flour, Besan, Cold-Pressed Oil, Spices, Rock Salt',
  energyKcal: 410,
  proteinG: 10.2,
  carbsG: 66.0,
  fiberG: 9.5,
  fatG: 10.5,
  saturatedFatG: 1.8,
  sodiumMg: 460,
  stock: 50,
  featured: true,
};

export const AdminDashboardPage: React.FC = () => {
  usePageMeta({ title: 'Admin Dashboard' });
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [trials, setTrials] = useState<TrialRequest[]>([]);
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [savingProduct, setSavingProduct] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, o, t, s, m] = await Promise.all([
        getAllProducts(),
        getAllOrders(),
        getAllTrialRequests(),
        getAllSurveys(),
        getAllContactMessages(),
      ]);
      setProducts(p);
      setOrders(o);
      setTrials(t);
      setSurveys(s);
      setMessages(m);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch admin data. Check Firestore permissions.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const stats = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'Cancelled');
    const totalRevenue = validOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    const packsSold = validOrders.reduce(
      (acc, o) => acc + o.items.reduce((sum, item) => sum + item.quantity, 0),
      0
    );
    return {
      totalOrders: orders.length,
      totalRevenue,
      packsSold,
      trialCount: trials.length,
      surveyCount: surveys.length,
    };
  }, [orders, trials, surveys]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await seedSampleProducts();
      if (res.skipped) {
        showToast('Products already exist in Firestore.', 'info');
      } else {
        showToast(`Seeded ${res.inserted} sample Milletly snacks!`);
        await loadAll();
      }
    } catch (err) {
      console.error(err);
      showToast('Seeding failed. Ensure your email matches firestore.rules.', 'error');
    } finally {
      setSeeding(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      flavour: product.flavour,
      milletType: product.milletType,
      price: product.price,
      trialPrice: product.trialPrice,
      weightGrams: product.weightGrams || 200,
      trialWeightGrams: product.trialWeightGrams || 50,
      imageUrls: (product.images || []).join(', '),
      ingredientsText: (product.ingredients || []).join(', '),
      energyKcal: product.nutrition?.energyKcal || 400,
      proteinG: product.nutrition?.proteinG || 10,
      carbsG: product.nutrition?.carbsG || 65,
      fiberG: product.nutrition?.fiberG || 9,
      fatG: product.nutrition?.fatG || 10,
      saturatedFatG: product.nutrition?.saturatedFatG || 1.5,
      sodiumMg: product.nutrition?.sodiumMg || 450,
      stock: product.stock,
      featured: product.featured,
    });
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const images = form.imageUrls
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const ingredients = form.ingredientsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: Omit<Product, 'id' | 'createdAt'> = {
        name: form.name.trim(),
        slug: form.name.trim().toLowerCase().replace(/\s+/g, '-'),
        description: form.description.trim(),
        flavour: form.flavour.trim(),
        milletType: form.milletType.trim(),
        price: Number(form.price),
        trialPrice: Number(form.trialPrice),
        weightGrams: Number(form.weightGrams),
        trialWeightGrams: Number(form.trialWeightGrams),
        images:
          images.length > 0
            ? images
            : ['/src/assets/images/product_ragi_chips_1795195409071.jpg'],
        ingredients: ingredients.length > 0 ? ingredients : ['Whole-grain Millet'],
        nutrition: {
          servingSize: '100g',
          energyKcal: Number(form.energyKcal),
          proteinG: Number(form.proteinG),
          carbsG: Number(form.carbsG),
          fiberG: Number(form.fiberG),
          fatG: Number(form.fatG),
          saturatedFatG: Number(form.saturatedFatG),
          sodiumMg: Number(form.sodiumMg),
        },
        stock: Number(form.stock),
        featured: form.featured,
      };

      if (editingId) {
        await updateProduct(editingId, payload);
        showToast('Product updated');
      } else {
        await createProduct(payload);
        showToast('Product created');
      }
      setModalOpen(false);
      await loadAll();
    } catch (err) {
      console.error(err);
      showToast('Failed to save product.', 'error');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    try {
      await deleteProduct(id);
      showToast(`Deleted "${name}"`, 'info');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      showToast('Could not delete product.', 'error');
    }
  };

  const handleOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      showToast(`Order marked as ${status}`);
    } catch {
      showToast('Failed to update order status.', 'error');
    }
  };

  const handleTrialStatus = async (id: string, status: TrialRequestStatus) => {
    try {
      await updateTrialRequestStatus(id, status);
      setTrials((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
      showToast(`Trial request marked as ${status}`);
    } catch {
      showToast('Failed to update trial status.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold text-saffron-600 tracking-wide">Operations Hub</p>
          <h1 className="text-3xl font-extrabold text-charcoal-900">Milletly Admin Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-millet-200 hover:border-forest-500 text-sm font-semibold text-charcoal-800 transition cursor-pointer"
          >
            <Database className="w-4 h-4 text-forest-500" />
            <span>{seeding ? 'Seeding...' : 'Seed Sample Data'}</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-500 hover:bg-forest-600 text-white text-sm font-semibold transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 tabular-nums">
        <div className="bg-white rounded-2xl p-5 border border-millet-200 shadow-soft">
          <ShoppingBag className="w-5 h-5 text-forest-500 mb-2" />
          <p className="text-xs text-charcoal-600 font-medium">Total Orders</p>
          <p className="text-2xl font-extrabold text-charcoal-900 mt-0.5">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-millet-200 shadow-soft">
          <IndianRupee className="w-5 h-5 text-saffron-500 mb-2" />
          <p className="text-xs text-charcoal-600 font-medium">Total Revenue</p>
          <p className="text-2xl font-extrabold text-charcoal-900 mt-0.5">₹{stats.totalRevenue}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-millet-200 shadow-soft">
          <PackageCheck className="w-5 h-5 text-forest-500 mb-2" />
          <p className="text-xs text-charcoal-600 font-medium">Packs Sold</p>
          <p className="text-2xl font-extrabold text-charcoal-900 mt-0.5">{stats.packsSold}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-millet-200 shadow-soft">
          <Sparkles className="w-5 h-5 text-saffron-500 mb-2" />
          <p className="text-xs text-charcoal-600 font-medium">Trial Requests</p>
          <p className="text-2xl font-extrabold text-charcoal-900 mt-0.5">{stats.trialCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-millet-200 shadow-soft col-span-2 sm:col-span-1">
          <ClipboardList className="w-5 h-5 text-forest-500 mb-2" />
          <p className="text-xs text-charcoal-600 font-medium">Survey Count</p>
          <p className="text-2xl font-extrabold text-charcoal-900 mt-0.5">{stats.surveyCount}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-white rounded-2xl border border-millet-200 mb-6 w-fit">
        {(
          [
            { id: 'products', label: `Products (${products.length})` },
            { id: 'orders', label: `Orders (${orders.length})` },
            { id: 'trials', label: `Trial Requests (${trials.length})` },
            { id: 'surveys', label: `Surveys (${surveys.length})` },
            { id: 'messages', label: `Messages (${messages.length})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-forest-500 text-white'
                : 'text-charcoal-700 hover:bg-millet-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-millet-200">
          <div className="w-10 h-10 border-4 border-forest-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-millet-200 shadow-soft overflow-hidden">
          {activeTab === 'products' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm tabular-nums">
                <thead className="bg-millet-50 border-b border-millet-200 text-xs font-bold text-charcoal-700">
                  <tr>
                    <th className="px-5 py-3.5">Snack</th>
                    <th className="px-5 py-3.5">Flavour / Millet</th>
                    <th className="px-5 py-3.5">Price (200g / Trial)</th>
                    <th className="px-5 py-3.5">Stock</th>
                    <th className="px-5 py-3.5">Featured</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-millet-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-millet-50/50">
                      <td className="px-5 py-4 flex items-center gap-3">
                        <ProductImage
                          src={p.images?.[0]}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <span className="font-bold text-charcoal-900">{p.name}</span>
                      </td>
                      <td className="px-5 py-4 text-charcoal-700">
                        {p.flavour} · {p.milletType}
                      </td>
                      <td className="px-5 py-4 font-semibold">
                        ₹{p.price} / ₹{p.trialPrice}
                      </td>
                      <td className="px-5 py-4">{p.stock}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-bold ${
                            p.featured ? 'text-forest-600' : 'text-charcoal-600'
                          }`}
                        >
                          {p.featured ? 'Featured' : 'Standard'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-2 rounded-lg hover:bg-millet-100 text-forest-600 cursor-pointer"
                          aria-label="Edit product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-charcoal-600">
                        No products yet. Click &ldquo;Seed Sample Data&rdquo; above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="divide-y divide-millet-100">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-bold text-charcoal-900 tabular-nums">
                      #{order.id.slice(0, 8).toUpperCase()} · ₹{order.total}
                    </p>
                    <p className="text-xs text-charcoal-600 mt-0.5">
                      {order.address.name} ({order.phone}) · {order.address.addressLine},{' '}
                      {order.address.city} - {order.address.pincode}
                    </p>
                    <p className="text-xs text-charcoal-700 mt-1">
                      {order.items
                        .map((i) => `${i.name} (${i.variantLabel}) × ${i.quantity}`)
                        .join(', ')}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => handleOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="px-3.5 py-2 rounded-xl bg-millet-50 border border-millet-200 text-sm font-semibold cursor-pointer"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="p-10 text-center text-charcoal-600 text-sm">No orders yet.</p>
              )}
            </div>
          )}

          {activeTab === 'trials' && (
            <div className="divide-y divide-millet-100">
              {trials.map((t) => (
                <div
                  key={t.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-bold text-charcoal-900">
                      {t.name} · <span className="text-forest-600">{t.preferredFlavour}</span>
                    </p>
                    <p className="text-xs text-charcoal-600">
                      {t.phone} · {t.email} · {t.city} ({t.pincode})
                    </p>
                    <p className="text-xs text-charcoal-700 mt-1">
                      Address: {t.address} | Habit: {t.currentSnackHabit}
                    </p>
                    {t.tasteFeedback && (
                      <p className="text-xs text-saffron-600 mt-1">Feedback: {t.tasteFeedback}</p>
                    )}
                  </div>
                  <select
                    value={t.status}
                    onChange={(e) =>
                      handleTrialStatus(t.id, e.target.value as TrialRequestStatus)
                    }
                    className="px-3.5 py-2 rounded-xl bg-millet-50 border border-millet-200 text-sm font-semibold cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              ))}
              {trials.length === 0 && (
                <p className="p-10 text-center text-charcoal-600 text-sm">
                  No trial requests yet.
                </p>
              )}
            </div>
          )}

          {activeTab === 'surveys' && (
            <div className="divide-y divide-millet-100">
              {surveys.map((s) => (
                <div key={s.id} className="p-5 space-y-1 tabular-nums">
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-bold text-charcoal-900">
                      {s.userName} ({s.userEmail})
                    </p>
                    <span className="text-xs font-bold text-saffron-600">
                      Rating: {s.tasteRating}/5 · WTP: ₹{s.willingnessToPay} · Buy Again:{' '}
                      {s.wouldBuyAgain}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-600">
                    Habit: {s.currentSnackingHabits} | Spend: {s.monthlySpend} | Flavours:{' '}
                    {s.preferredFlavours?.join(', ')}
                  </p>
                  {s.comments && (
                    <p className="text-sm text-charcoal-800 pt-1">&ldquo;{s.comments}&rdquo;</p>
                  )}
                </div>
              ))}
              {surveys.length === 0 && (
                <p className="p-10 text-center text-charcoal-600 text-sm">No survey responses.</p>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="divide-y divide-millet-100">
              {messages.map((m) => (
                <div key={m.id} className="p-5">
                  <p className="font-bold text-charcoal-900">
                    {m.subject} <span className="font-normal text-charcoal-600">by {m.name}</span>
                  </p>
                  <p className="text-xs text-forest-600 mb-2">{m.email}</p>
                  <p className="text-sm text-charcoal-700">{m.message}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="p-10 text-center text-charcoal-600 text-sm">No contact messages.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-charcoal-900">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl hover:bg-millet-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-millet-50 border border-millet-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Flavour</label>
                  <input
                    type="text"
                    required
                    value={form.flavour}
                    onChange={(e) => setForm({ ...form, flavour: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-millet-50 border border-millet-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Millet Base</label>
                  <input
                    type="text"
                    required
                    value={form.milletType}
                    onChange={(e) => setForm({ ...form, milletType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-millet-50 border border-millet-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-millet-50 border border-millet-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">200g Price (₹)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-millet-50 border border-millet-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Trial Price (₹)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={form.trialPrice}
                    onChange={(e) => setForm({ ...form, trialPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-millet-50 border border-millet-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Weight (g)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={form.weightGrams}
                    onChange={(e) => setForm({ ...form, weightGrams: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-millet-50 border border-millet-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Trial (g)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={form.trialWeightGrams}
                    onChange={(e) =>
                      setForm({ ...form, trialWeightGrams: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-millet-50 border border-millet-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-millet-50 border border-millet-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  Image URLs (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.imageUrls}
                  onChange={(e) => setForm({ ...form, imageUrls: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-millet-50 border border-millet-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  Ingredients (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.ingredientsText}
                  onChange={(e) => setForm({ ...form, ingredientsText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-millet-50 border border-millet-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Kcal / 100g</label>
                  <input
                    type="number"
                    value={form.energyKcal}
                    onChange={(e) => setForm({ ...form, energyKcal: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-millet-50 border border-millet-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.proteinG}
                    onChange={(e) => setForm({ ...form, proteinG: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-millet-50 border border-millet-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Fiber (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.fiberG}
                    onChange={(e) => setForm({ ...form, fiberG: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-millet-50 border border-millet-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.fatG}
                    onChange={(e) => setForm({ ...form, fatG: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-millet-50 border border-millet-200 text-sm"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded text-forest-600"
                />
                <span>Feature on Home Page</span>
              </label>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-millet-200 text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-6 py-2.5 rounded-xl bg-forest-500 hover:bg-forest-600 text-white text-sm font-semibold cursor-pointer"
                >
                  {savingProduct ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
