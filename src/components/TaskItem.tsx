import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, GripVertical } from 'lucide-react';
import { useState } from 'react';

interface TaskItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
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
      className="absolute rounded-full bg-gradient-to-br from-[#cd7f32] via-[#d4af37] to-[#cd7f32]"
      style={{
        width: size,
        height: size,
        left: '50%',
        top: '50%',
        boxShadow: '0 0 6px rgba(255, 153, 102, 0.8)',
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

export default function TaskItem({ id, text, completed, onToggle, onDelete, isMidnight: _isMidnight, dragHandleProps }: TaskItemProps) {
  const [isDestroying, setIsDestroying] = useState(false);

  const handleToggle = () => {
    onToggle(id);
  };

  const handleDeleteWithAnimation = () => {
    setIsDestroying(true);
    setTimeout(() => {
      onDelete(id);
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
            className="absolute inset-0 bg-gradient-to-r from-[#cd7f32] via-[#d4af37] to-[#cd7f32] opacity-20 rounded-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-amber-400 to-[#cd7f32] opacity-25 rounded-xl"
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
          className="drag-handle cursor-grab active:cursor-grabbing opacity-30 group-hover:opacity-80 transition-opacity text-[#d4af37]"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Checkbox */}
        <motion.button
          onClick={handleToggle}
          className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
            completed
              ? 'border-[#d4af37] bg-[#d4af37]/20'
              : 'border-[#d4af37]/60 hover:bg-[#d4af37]/10'
          }`}
          disabled={isDestroying}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence>
            {completed && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Check className="w-3 h-3 text-[#ddc3a5]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Task Text */}
        <motion.span
          className={`flex-1 text-sm font-medium transition-all ${
            completed
              ? 'line-through text-[#d4af37]/50'
              : 'text-[#ddc3a5]'
          } ${isDestroying ? 'opacity-30' : ''}`}
          animate={isDestroying ? {
            x: 6,
            transition: { duration: 0.3 }
          } : {}}
        >
          {text}
        </motion.span>

        {/* Delete Button */}
        <motion.button
          onClick={handleDeleteWithAnimation}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#cd7f32] hover:text-[#cd7f32] p-1 rounded hover:bg-orange-500/10"
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
