import { X, Moon, Sun, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isMidnight: boolean;
  onToggleMidnight: () => void;
  onBackgroundChange: (background: string | null) => void;
}

export default function Settings({
  isOpen,
  onClose,
  isMidnight,
  onToggleMidnight,
  onBackgroundChange,
}: SettingsProps) {
  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onBackgroundChange(result);
        localStorage.setItem('productivity-dashboard-background', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = () => {
    onBackgroundChange(null);
    localStorage.removeItem('productivity-dashboard-background');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 bottom-0 w-80 glass-effect border-l-2 border-[#d4af37]/40 shadow-2xl z-[9999] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-4 border-b-2 border-[#d4af37]/40 flex items-center justify-between sticky top-0 bg-black/20 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-[#d4af37]" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
                Settings
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[#d4af37]/20 transition-colors"
              >
                <X className="w-5 h-5 text-[#d4af37]" />
              </button>
            </div>

            {/* Settings Content */}
            <div className="p-4 space-y-6">
              {/* Theme Toggle */}
              <div>
                <h3 className="text-sm font-semibold text-[#d4af37] mb-3 flex items-center gap-2">
                  {isMidnight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  Theme
                </h3>
                <button
                  onClick={onToggleMidnight}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isMidnight
                      ? 'bg-[#1a120d] border-2 border-[#d4af37] text-[#d4af37]'
                      : 'bg-[#d4af37]/20 border-2 border-[#d4af37]/40 text-[#ddc3a5] hover:border-[#d4af37]/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Midnight Mode</span>
                    <div className={`w-10 h-6 rounded-full relative transition-colors ${
                      isMidnight ? 'bg-[#d4af37]' : 'bg-white/20'
                    }`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        isMidnight ? 'right-1' : 'left-1'
                      }`} />
                    </div>
                  </div>
                </button>
              </div>

              {/* Background Selector */}
              <div>
                <h3 className="text-sm font-semibold text-[#d4af37] mb-3 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Background
                </h3>
                <div className="space-y-2">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      className="hidden"
                      id="background-upload"
                    />
                    <div className="w-full px-4 py-3 rounded-lg text-sm font-medium bg-[#d4af37]/20 border-2 border-[#d4af37]/40 text-[#ddc3a5] hover:border-[#d4af37]/60 hover:bg-[#d4af37]/30 transition-all cursor-pointer text-center">
                      Upload Background Image
                    </div>
                  </label>
                  <button
                    onClick={handleRemoveBackground}
                    className="w-full px-4 py-3 rounded-lg text-sm font-medium bg-red-900/20 border-2 border-red-500/40 text-red-300 hover:border-red-500/60 hover:bg-red-900/30 transition-all"
                  >
                    Remove Background
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="pt-4 border-t-2 border-[#d4af37]/20">
                <p className="text-xs text-white/50 text-center" style={{ fontFamily: 'Lora, Georgia, serif' }}>
                  Click "Edit Layout" to rearrange and resize dashboard components
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
