import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, GripVertical } from 'lucide-react';
import { useState } from 'react';

interface TaskItemProps {
  id: string;
  text: string;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  isMidnight: boolean;
  dragHandleProps?: any;
}

const Particle = ({ index }: { index: number }) => {
  const angle = (index / 25) * Math.PI * 2;
  const distance = 80 + Math.random() * 60;
  const tx = Math.cos(angle) * distance;
  const ty = Math.sin(angle) * distance;
  const rotation = Math.random() * 720;
  const size = 3 + Math.random() * 5;
  const delay = Math.random() * 0.15;

  return (
    <motion.div
      className="absolute rounded-full bg-gradient-to-br from-red-500 via-red-400 to-red-600"
      style={{
        width: size,
        height: size,
        left: '50%',
        top: '50%',
        boxShadow: '0 0 6px rgba(255, 51, 51, 0.8)',
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
        duration: 0.9,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    />
  );
};

export default function TaskItem({ id, text, onComplete, onDelete, isMidnight, dragHandleProps }: TaskItemProps) {
  const [isDestroying, setIsDestroying] = useState(false);

  const handleComplete = () => {
    setIsDestroying(true);
    setTimeout(() => {
      onComplete(id);
    }, 1100);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isDestroying ? {
        scale: 0.90,
        opacity: 0.6,
        transition: { duration: 0.4, ease: 'easeInOut' }
      } : {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: 'easeOut' }
      }}
      exit={{
        scale: 0,
        opacity: 0,
        transition: { duration: 0.5, ease: 'easeIn' }
      }}
      className="glass-effect rounded-lg p-3 shadow-glow group relative overflow-visible"
    >
      {/* Particle effects */}
      <AnimatePresence>
        {isDestroying && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {Array.from({ length: 25 }).map((_, i) => (
              <Particle key={i} index={i} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Success wave animation */}
      {isDestroying && (
        <>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-20 rounded-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 opacity-25 rounded-xl"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        </>
      )}

      <div className="flex items-center gap-2 relative z-10">
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="drag-handle cursor-grab active:cursor-grabbing opacity-30 group-hover:opacity-80 transition-opacity text-red-500"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Checkbox */}
        <motion.button
          onClick={handleComplete}
          className="w-5 h-5 rounded-full border-2 border-red-500 transition-all flex items-center justify-center hover:bg-red-500/10"
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
                <Check className="w-3 h-3 text-red-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Task Text */}
        <motion.span
          className={`flex-1 text-sm font-medium text-red-400 transition-all ${isDestroying ? 'line-through opacity-30' : ''}`}
          animate={isDestroying ? {
            x: 6,
            transition: { duration: 0.3 }
          } : {}}
        >
          {text}
        </motion.span>

        {/* Delete Button */}
        <motion.button
          onClick={() => onDelete(id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10"
          disabled={isDestroying}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
