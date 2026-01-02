import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

interface TaskItemProps {
  id: string;
  text: string;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ id, text, onComplete, onDelete }: TaskItemProps) {
  const [isDestroying, setIsDestroying] = useState(false);

  const handleComplete = () => {
    setIsDestroying(true);
    setTimeout(() => {
      onComplete(id);
    }, 600);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={isDestroying ? {
        scale: 0,
        rotate: 15,
        opacity: 0,
        transition: { duration: 0.6, ease: 'easeOut' }
      } : {
        opacity: 1,
        y: 0
      }}
      className="glass-effect rounded-xl p-4 shadow-warm group relative overflow-hidden"
    >
      {isDestroying && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-30"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}

      <div className="flex items-center gap-3 relative z-10">
        <button
          onClick={handleComplete}
          className="w-6 h-6 rounded-full border-2 border-warm-400 hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center group-hover:scale-110"
          disabled={isDestroying}
        >
          {isDestroying && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Check className="w-4 h-4 text-green-600" />
            </motion.div>
          )}
        </button>

        <span className={`flex-1 text-gray-700 transition-all ${isDestroying ? 'line-through opacity-50' : ''}`}>
          {text}
        </span>

        <button
          onClick={() => onDelete(id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50"
          disabled={isDestroying}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
