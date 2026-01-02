import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

interface TaskItemProps {
  id: string;
  text: string;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  isMidnight: boolean;
}

const Particle = ({ index, isMidnight }: { index: number; isMidnight: boolean }) => {
  const angle = (index / 20) * Math.PI * 2;
  const distance = 100 + Math.random() * 50;
  const tx = Math.cos(angle) * distance;
  const ty = Math.sin(angle) * distance;
  const rotation = Math.random() * 360;
  const size = 4 + Math.random() * 6;
  const delay = Math.random() * 0.1;

  return (
    <motion.div
      className={`absolute rounded-full ${
        isMidnight ? 'bg-gradient-to-br from-red-500 to-orange-600' : 'bg-gradient-to-br from-blue-400 to-cyan-500'
      }`}
      style={{
        width: size,
        height: size,
        left: '50%',
        top: '50%',
      }}
      initial={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
      animate={{
        opacity: 0,
        scale: 0,
        x: tx,
        y: ty,
        rotate: rotation,
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    />
  );
};

export default function TaskItem({ id, text, onComplete, onDelete, isMidnight }: TaskItemProps) {
  const [isDestroying, setIsDestroying] = useState(false);

  const handleComplete = () => {
    setIsDestroying(true);
    setTimeout(() => {
      onComplete(id);
    }, 1000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={isDestroying ? {
        scale: 0.95,
        opacity: 0.7,
        transition: { duration: 0.3, ease: 'easeInOut' }
      } : {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      exit={{
        scale: 0,
        opacity: 0,
        transition: { duration: 0.4, ease: 'easeIn' }
      }}
      className="glass-effect rounded-lg p-3 shadow-warm group relative overflow-visible"
    >
      {/* Particle effects */}
      <AnimatePresence>
        {isDestroying && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <Particle key={i} index={i} isMidnight={isMidnight} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Success wave animation */}
      {isDestroying && (
        <>
          <motion.div
            className={`absolute inset-0 opacity-20 rounded-lg ${
              isMidnight ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            }`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-30 rounded-lg"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </>
      )}

      <div className="flex items-center gap-2 relative z-10">
        <motion.button
          onClick={handleComplete}
          className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
            isMidnight
              ? 'border-red-400 hover:border-green-400 hover:bg-green-500/20'
              : 'border-blue-400 hover:border-green-400 hover:bg-green-500/20'
          }`}
          disabled={isDestroying}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence>
            {isDestroying && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Check className="w-3 h-3 text-green-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.span
          className={`flex-1 text-sm transition-all ${
            isMidnight ? 'text-red-100' : 'text-slate-200'
          } ${isDestroying ? 'line-through opacity-40' : ''}`}
          animate={isDestroying ? {
            x: 10,
            transition: { duration: 0.3 }
          } : {}}
        >
          {text}
        </motion.span>

        <motion.button
          onClick={() => onDelete(id)}
          className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg ${
            isMidnight
              ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
              : 'text-red-400 hover:text-red-500 hover:bg-red-500/10'
          }`}
          disabled={isDestroying}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-3 h-3" />
        </motion.button>
      </div>
    </motion.div>
  );
}
