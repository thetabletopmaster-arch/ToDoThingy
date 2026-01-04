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
];

export default function QuickLinks({ isMidnight }: { isMidnight: boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {links.map((link, index) => (
        <motion.a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="border-2 border-amber-500 bg-transparent text-amber-400 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:bg-amber-500/10 hover:border-amber-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{link.name}</span>
          <ExternalLink className="w-4 h-4" />
        </motion.a>
      ))}
    </div>
  );
}
