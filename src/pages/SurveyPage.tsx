import React, { useState } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { usePageMeta } from '../hooks/usePageMeta';
import { submitSurvey } from '../services/surveyService';

const FLAVOUR_OPTIONS = [
  'Desi Masala',
  'Peri-Peri',
  'Cheese & Herb',
  'Tangy Tomato',
  'Pudina & Mint',
  'Classic Salted',
];

export const SurveyPage: React.FC = () => {
  usePageMeta({
    title: 'Snack Habits & Taste Survey',
    description: 'Shape Milletly’s upcoming baked millet snack flavours and pricing.',
  });

  const { user, signInWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [currentSnackingHabits, setCurrentSnackingHabits] = useState('Potato Chips / Namkeen');
  const [monthlySpend, setMonthlySpend] = useState('₹300 – ₹600');
  const [preferredFlavours, setPreferredFlavours] = useState<string[]>(['Desi Masala', 'Peri-Peri']);
  const [willingnessToPay, setWillingnessToPay] = useState<number>(250);
  const [tasteRating, setTasteRating] = useState<number>(5);
  const [wouldBuyAgain, setWouldBuyAgain] = useState<'Yes' | 'Maybe' | 'No'>('Yes');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleFlavour = (flavour: string) => {
    setPreferredFlavours((prev) =>
      prev.includes(flavour) ? prev.filter((f) => f !== flavour) : [...prev, flavour]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in with Google to submit your survey.', 'info');
      return;
    }

    setSubmitting(true);
    try {
      await submitSurvey({
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || 'Anonymous',
        currentSnackingHabits,
        monthlySpend,
        preferredFlavours,
        willingnessToPay,
        tasteRating,
        wouldBuyAgain,
        comments: comments.trim(),
      });
      setSubmitted(true);
      showToast('Thank you! Your feedback has been saved.');
    } catch (err) {
      console.error(err);
      showToast('Could not submit survey. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-[2rem] p-10 border border-millet-200 shadow-soft">
          <CheckCircle2 className="w-14 h-14 text-forest-500 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-charcoal-900 mb-2">
            Thanks for shaping Milletly!
          </h1>
          <p className="text-sm text-charcoal-600 mb-6">
            Your insights directly influence our next baked flavours and pack pricing.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 rounded-xl bg-forest-500 text-white font-semibold text-sm cursor-pointer"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="text-center mb-8">
        <p className="text-xs font-semibold text-forest-600 tracking-wide">2-Minute Feedback</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 mt-1">
          Snacking Habits & Taste Survey
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 mt-2">
          Help us validate what urban Indians actually crave and want to pay for healthy snacks.
        </p>
      </div>

      {!user && (
        <div className="mb-6 bg-saffron-50 border border-saffron-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm font-medium text-charcoal-800">
            Sign in with Google to record your survey response.
          </p>
          <button
            type="button"
            onClick={() => signInWithGoogle()}
            className="px-5 py-2.5 rounded-xl bg-forest-500 text-white text-sm font-semibold shrink-0 cursor-pointer"
          >
            Sign in with Google
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[2rem] p-6 sm:p-10 border border-millet-200 shadow-soft space-y-6"
      >
        <div>
          <label className="block text-sm font-bold text-charcoal-900 mb-2">
            1. What is your go-to packaged snack right now?
          </label>
          <select
            value={currentSnackingHabits}
            onChange={(e) => setCurrentSnackingHabits(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm"
          >
            <option value="Potato Chips / Namkeen">Potato Chips / Namkeen (Lays, Haldiram’s)</option>
            <option value="Biscuits & Cookies">Biscuits & Cookies</option>
            <option value="Roasted Makhana / Dry Fruits">Roasted Makhana / Nuts</option>
            <option value="Protein Bars / Health Snacks">Protein Bars / Premium Health Snacks</option>
            <option value="Bakery / Street Snacks">Bakery / Street Snacks</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-charcoal-900 mb-2">
            2. How much do you spend monthly on packaged snacks?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {['Under ₹300', '₹300 – ₹600', '₹600 – ₹1000', '₹1000+'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setMonthlySpend(opt)}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition cursor-pointer ${
                  monthlySpend === opt
                    ? 'bg-forest-500 text-white border-forest-500'
                    : 'bg-millet-50 text-charcoal-700 border-millet-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-charcoal-900 mb-2">
            3. Which baked millet flavours excite you most? (Pick all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {FLAVOUR_OPTIONS.map((flavour) => {
              const selected = preferredFlavours.includes(flavour);
              return (
                <button
                  key={flavour}
                  type="button"
                  onClick={() => toggleFlavour(flavour)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition cursor-pointer ${
                    selected
                      ? 'bg-saffron-500 text-white border-saffron-500'
                      : 'bg-millet-50 text-charcoal-700 border-millet-200'
                  }`}
                >
                  {flavour}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-charcoal-900 mb-2">
            4. Fair price you’d happily pay for a 200g pack of baked millet snacks:
          </label>
          <div className="grid grid-cols-3 gap-3 tabular-nums">
            {[200, 250, 300].map((price) => (
              <button
                key={price}
                type="button"
                onClick={() => setWillingnessToPay(price)}
                className={`py-3 rounded-xl font-extrabold text-sm border-2 transition cursor-pointer ${
                  willingnessToPay === price
                    ? 'border-forest-500 bg-forest-50 text-forest-700'
                    : 'border-millet-200 bg-millet-50 text-charcoal-700'
                }`}
              >
                ₹{price}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-charcoal-900 mb-2">
            5. Taste / Concept Rating (1 = Poor, 5 = Love it)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setTasteRating(num)}
                className="p-2 rounded-xl hover:bg-millet-50 transition cursor-pointer"
                aria-label={`Rate ${num} stars`}
              >
                <Star
                  className={`w-7 h-7 ${
                    num <= tasteRating
                      ? 'text-saffron-500 fill-saffron-500'
                      : 'text-millet-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm font-bold text-charcoal-700 tabular-nums">
              {tasteRating} / 5
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-charcoal-900 mb-2">
            6. Would you buy Milletly regularly instead of fried chips?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['Yes', 'Maybe', 'No'] as const).map((ans) => (
              <button
                key={ans}
                type="button"
                onClick={() => setWouldBuyAgain(ans)}
                className={`py-2.5 rounded-xl font-bold text-sm border transition cursor-pointer ${
                  wouldBuyAgain === ans
                    ? 'bg-forest-500 text-white border-forest-500'
                    : 'bg-millet-50 text-charcoal-700 border-millet-200'
                }`}
              >
                {ans}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-charcoal-900 mb-2">
            7. Any honest feedback or flavour ideas?
          </label>
          <textarea
            rows={3}
            maxLength={1000}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Tell us what makes a snack irresistible for you..."
            className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !user}
          className="w-full py-4 rounded-2xl bg-forest-500 hover:bg-forest-600 disabled:bg-gray-300 text-white font-bold text-base transition cursor-pointer"
        >
          {submitting ? 'Submitting...' : 'Submit Survey'}
        </button>
      </form>
    </div>
  );
};
