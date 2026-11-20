import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { usePageMeta } from '../hooks/usePageMeta';
import { createTrialRequest, getUserTrialRequests } from '../services/trialService';
import { TrialRequest } from '../types';

export const TrialRequestPage: React.FC = () => {
  usePageMeta({
    title: 'Request a Free Trial Pack',
    description:
      'Try Milletly baked millet snacks for free in Delhi NCR, Mumbai & Bengaluru and share your taste feedback.',
  });

  const { user, userProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [preferredFlavour, setPreferredFlavour] = useState('Masala Ragi Chips');
  const [currentSnackHabit, setCurrentSnackHabit] = useState('');
  const [tasteFeedback, setTasteFeedback] = useState('');
  const [feedbackConsent, setFeedbackConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingRequests, setExistingRequests] = useState<TrialRequest[]>([]);

  useEffect(() => {
    if (userProfile) {
      setName((prev) => prev || userProfile.name || '');
      setPhone((prev) => prev || userProfile.phone || '');
      setAddress((prev) => prev || userProfile.address || '');
      setPincode((prev) => prev || userProfile.pincode || '');
    } else if (user) {
      setName((prev) => prev || user.displayName || '');
    }
  }, [user, userProfile]);

  useEffect(() => {
    const loadExisting = async () => {
      if (!user) return;
      try {
        const list = await getUserTrialRequests(user.uid);
        setExistingRequests(list);
      } catch (err) {
        console.error(err);
      }
    };
    loadExisting();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      showToast('Please enter a valid 10-digit Indian mobile number.', 'error');
      return;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      showToast('Please enter a valid 6-digit Indian pincode.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await createTrialRequest({
        userId: user.uid,
        name: name.trim(),
        email: user.email || '',
        phone: phone.trim(),
        city,
        address: address.trim(),
        pincode: pincode.trim(),
        preferredFlavour,
        currentSnackHabit: currentSnackHabit.trim(),
        tasteFeedback: tasteFeedback.trim(),
        feedbackConsent,
      });

      showToast('Trial pack request submitted! We’ll update you soon.');
      const updated = await getUserTrialRequests(user.uid);
      setExistingRequests(updated);
      setCurrentSnackHabit('');
      setTasteFeedback('');
    } catch (err) {
      console.error(err);
      showToast('Could not submit request. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="text-xs font-semibold text-saffron-600 tracking-wide mb-2">
          30-Day Community Taste Program
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900">
          Request a Free Milletly Trial Pack
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 mt-2">
          Help us build India’s tastiest everyday millet snack. Request a complimentary 50g sample
          pack and tell us honestly what you think.
        </p>
      </div>

      {existingRequests.length > 0 && (
        <div className="mb-8 bg-forest-50 border border-forest-100 rounded-3xl p-6">
          <h2 className="font-bold text-forest-700 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5" /> Your Trial Request History
          </h2>
          <div className="space-y-2">
            {existingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-3.5 border border-forest-100 flex flex-wrap items-center justify-between gap-2 text-sm"
              >
                <div>
                  <span className="font-bold text-charcoal-900">{req.preferredFlavour}</span>
                  <span className="text-charcoal-600"> · {req.city}</span>
                </div>
                <span className="text-xs font-bold text-saffron-600">Status: {req.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[2rem] p-6 sm:p-10 border border-millet-200 shadow-soft space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
              WhatsApp / Mobile Number
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">City Hub</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
            >
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Other Indian City">Other Indian City</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
              Preferred Sample Flavour
            </label>
            <select
              value={preferredFlavour}
              onChange={(e) => setPreferredFlavour(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
            >
              <option value="Masala Ragi Chips">Masala Ragi Chips (Desi Masala)</option>
              <option value="Jowar Peri-Peri Puffs">Jowar Peri-Peri Puffs (Spicy)</option>
              <option value="Bajra Cheese Crunch">Bajra Cheese Crunch (Cheesy)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
              Delivery Address
            </label>
            <input
              type="text"
              required
              minLength={5}
              maxLength={300}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Hostel / Flat / Office address"
              className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">Pincode</label>
            <input
              type="text"
              required
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="110001"
              className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
            What do you usually snack on around 4 PM or late night?
          </label>
          <input
            type="text"
            required
            minLength={2}
            maxLength={200}
            value={currentSnackHabit}
            onChange={(e) => setCurrentSnackHabit(e.target.value)}
            placeholder="e.g., Potato chips, biscuits, roasted makhana..."
            className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
            Already tried a sample? Share quick taste notes (optional)
          </label>
          <textarea
            rows={2}
            maxLength={600}
            value={tasteFeedback}
            onChange={(e) => setTasteFeedback(e.target.value)}
            placeholder="Tell us about crunch, spice level, or packaging..."
            className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
          />
        </div>

        <label className="flex items-start gap-2.5 text-sm text-charcoal-700 cursor-pointer">
          <input
            type="checkbox"
            checked={feedbackConsent}
            onChange={(e) => setFeedbackConsent(e.target.checked)}
            className="mt-1 rounded text-forest-600 focus:ring-forest-500"
          />
          <span>
            Yes, I agree to share quick 2-minute taste feedback after receiving my free trial pack.
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-2xl bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-base shadow-md transition disabled:opacity-60 inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{submitting ? 'Submitting Request...' : 'Request My Free Trial Pack'}</span>
        </button>
      </form>
    </div>
  );
};
