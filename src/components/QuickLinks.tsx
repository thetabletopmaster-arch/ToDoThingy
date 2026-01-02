import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickLink {
  name: string;
  url: string;
  color: string;
  midnightColor: string;
}

const links: QuickLink[] = [
  { name: 'Claude', url: 'https://claude.ai', color: 'bg-amber-600 hover:bg-amber-700', midnightColor: 'bg-red-900 hover:bg-red-800' },
  { name: 'ChatGPT', url: 'https://chat.openai.com', color: 'bg-emerald-600 hover:bg-emerald-700', midnightColor: 'bg-red-800 hover:bg-red-700' },
  { name: 'Skool', url: 'https://www.skool.com', color: 'bg-blue-600 hover:bg-blue-700', midnightColor: 'bg-red-700 hover:bg-red-600' },
  { name: 'Gmail', url: 'https://mail.google.com', color: 'bg-rose-600 hover:bg-rose-700', midnightColor: 'bg-red-600 hover:bg-red-500' },
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
          className={`${isMidnight ? link.midnightColor : link.color} text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg`}
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
