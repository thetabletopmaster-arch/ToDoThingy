import { Moon, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  isMidnight: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isMidnight, onToggle }: ThemeToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-[#d4af37] text-[#1a120d] transition-all hover:bg-[#cd7f32] shadow-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={isMidnight ? 'Switch to Dark Mode' : 'Switch to Midnight Mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isMidnight ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isMidnight ? <Flame className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </motion.div>
    </motion.button>
  );
}
