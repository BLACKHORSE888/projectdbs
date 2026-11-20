import React, { useState } from 'react';
import { Mail, MapPin, Send, Instagram } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useToast } from '../hooks/useToast';
import { submitContactMessage } from '../services/contactService';

export const ContactPage: React.FC = () => {
  usePageMeta({
    title: 'Contact Us',
    description: 'Reach out to Milletly for bulk office snacking, feedback, or order help.',
  });

  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      showToast('Message sent! We usually reply within 24 hours.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
      showToast('Could not send message. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-10">
        <p className="text-xs font-semibold text-forest-600 tracking-wide">Get In Touch</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 mt-1">
          Say hello to Milletly
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 mt-2">
          Questions about ingredients, campus pop-ups, office pantry boxes, or your order? Drop us a
          note.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-millet-200 shadow-soft">
            <Mail className="w-6 h-6 text-forest-500 mb-3" />
            <h2 className="font-bold text-charcoal-900">Email Support</h2>
            <p className="text-sm text-charcoal-600 mt-1">hello@milletly.in</p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-millet-200 shadow-soft">
            <MapPin className="w-6 h-6 text-saffron-500 mb-3" />
            <h2 className="font-bold text-charcoal-900">Core Cities</h2>
            <p className="text-sm text-charcoal-600 mt-1">
              Delhi NCR · Mumbai · Bengaluru (Shipping Pan-India)
            </p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-millet-200 shadow-soft">
            <Instagram className="w-6 h-6 text-forest-500 mb-3" />
            <h2 className="font-bold text-charcoal-900">Instagram</h2>
            <a
              href="https://instagram.com/milletly.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-forest-600 font-semibold hover:underline mt-1 inline-block"
            >
              @milletly.in
            </a>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-millet-200 shadow-soft space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">Your Name</label>
              <input
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priya Nair"
                className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                maxLength={150}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">Subject</label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={150}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Office snack box inquiry / Feedback"
              className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">Message</label>
            <textarea
              rows={4}
              required
              minLength={5}
              maxLength={2000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              className="w-full px-4 py-3 rounded-xl bg-millet-50 border border-millet-200 text-sm focus:outline-none focus:border-forest-500"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full py-3.5 rounded-2xl bg-forest-500 hover:bg-forest-600 text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer"
          >
            <span>{sending ? 'Sending...' : 'Send Message'}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
