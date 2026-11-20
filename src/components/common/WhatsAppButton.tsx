import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
  const message = encodeURIComponent(
    'Hey Milletly! I would like to know more about your baked millet snacks.'
  );
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all"
    >
      <MessageCircle className="w-5 h-5 fill-current shrink-0" />
      <span className="hidden sm:inline text-sm font-semibold whitespace-nowrap">
        WhatsApp
      </span>
    </a>
  );
};
