import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickLink {
  name: string;
  url: string;
}

const links: QuickLink[] = [
  { name: 'Claude', url: 'https://claude.ai' },
  { name: 'ChatGPT', url: 'https://chat.openai.com' },
  { name: 'Skool', url: 'https://www.skool.com' },
  { name: 'Gmail', url: 'https://mail.google.com' },
  { name: 'WhatsApp', url: 'https://web.whatsapp.com' },
];

export default function QuickLinks({ isMidnight: _isMidnight }: { isMidnight: boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {links.map((link, index) => (
        <motion.a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#d4af37] text-[#1a120d] px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-[#cd7f32] shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{link.name}</span>
          <ExternalLink className="w-3 h-3" />
        </motion.a>
      ))}
    </div>
  );
}
