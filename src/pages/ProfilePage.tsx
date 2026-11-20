import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Save, Package, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { usePageMeta } from '../hooks/usePageMeta';
import { updateUserProfile } from '../services/userService';

export const ProfilePage: React.FC = () => {
  usePageMeta({ title: 'My Profile' });
  const { user, userProfile, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setPhone(userProfile.phone || '');
      setAddress(userProfile.address || '');
      setCity(userProfile.city || '');
      setPincode(userProfile.pincode || '');
    }
  }, [userProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
      });
      await refreshProfile();
      showToast('Profile saved!');
    } catch {
      showToast('Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-millet-200 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-millet-100">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt={userProfile?.name || 'Profile'}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border border-millet-200"
            />
          )}
          <div>
            <h1 className="text-2xl font-extrabold text-charcoal-900">
              {userProfile?.name || user?.displayName}
            </h1>
            <p className="text-sm text-charcoal-600">{user?.email}</p>
          </div>
          <div className="sm:ml-auto flex gap-2">
            <Link
              to="/orders"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-millet-50 hover:bg-millet-200 text-xs font-bold text-charcoal-800 transition"
            >
              <Package className="w-4 h-4 text-forest-500" /> Orders
            </Link>
            <Link
              to="/trial"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-50 hover:bg-saffron-100 text-xs font-bold text-saffron-600 transition"
            >
              <Sparkles className="w-4 h-4" /> Free Trial
            </Link>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <h2 className="text-lg font-bold text-charcoal-900">Saved Delivery Preferences</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                placeholder="9876543210"
                className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">
              Default Address
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={300}
              placeholder="House / Flat, Street, Area"
              className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={80}
                placeholder="Mumbai"
                className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                placeholder="400001"
                className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-sm transition disabled:opacity-60 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
