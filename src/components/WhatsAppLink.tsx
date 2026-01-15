import { MessageCircle } from 'lucide-react';

interface WhatsAppLinkProps {
  isMidnight: boolean;
}

export default function WhatsAppLink({ isMidnight: _isMidnight }: WhatsAppLinkProps) {
  const openWhatsApp = () => {
    window.open('https://web.whatsapp.com', '_blank');
  };

  return (
    <div className="glass-effect rounded-xl p-4 shadow-glow">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="w-4 h-4 text-green-400" />
        <span className="text-sm font-medium text-white/80">WhatsApp</span>
      </div>

      <button
        onClick={openWhatsApp}
        className="w-full py-3 px-4 bg-green-500/20 hover:bg-green-500/30 text-white rounded-lg transition-all border border-green-400/40 hover:border-green-400"
      >
        <div className="flex items-center justify-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">Open WhatsApp</span>
        </div>
      </button>

      <div className="mt-3 text-xs text-white/50 text-center">
        Opens WhatsApp Web
      </div>
    </div>
  );
}
