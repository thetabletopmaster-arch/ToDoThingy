import { X, Moon, Sun, Image, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isMidnight: boolean;
  onToggleMidnight: () => void;
  onBackgroundChange: (background: string | null) => void;
  onApplyLayoutPreset: (preset: 'compact' | 'wide' | 'balanced') => void;
}

export default function Settings({
  isOpen,
  onClose,
  isMidnight,
  onToggleMidnight,
  onBackgroundChange,
  onApplyLayoutPreset,
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-8"
          onClick={onClose}
        >
          {/* Settings Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl glass-effect rounded-2xl border-2 border-[#d4af37]/40 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b-2 border-[#d4af37]/40 bg-black/20">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-[#d4af37]" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
                  Dashboard Settings
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[#d4af37]/20 transition-colors"
                >
                  <X className="w-6 h-6 text-[#d4af37]" />
                </button>
              </div>
              <p className="text-sm text-white/60 mt-2" style={{ fontFamily: 'Lora, Georgia, serif' }}>
                Customize your productivity dashboard
              </p>
            </div>

            {/* Settings Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
              {/* Layout Presets */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-[#d4af37] mb-4 flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  Layout Presets
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      onApplyLayoutPreset('compact');
                      onClose();
                    }}
                    className="group relative overflow-hidden rounded-xl border-2 border-[#d4af37]/40 bg-black/40 hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all p-4"
                  >
                    <div className="text-center">
                      <div className="w-full h-24 mb-3 rounded-lg bg-[#d4af37]/20 flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-1 w-16">
                          <div className="h-3 bg-[#d4af37]/60 rounded"></div>
                          <div className="h-3 bg-[#d4af37]/60 rounded"></div>
                          <div className="h-8 bg-[#d4af37]/60 rounded"></div>
                          <div className="h-8 bg-[#d4af37]/60 rounded"></div>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-[#d4af37]">Compact</p>
                      <p className="text-xs text-white/50 mt-1">Dense layout</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onApplyLayoutPreset('wide');
                      onClose();
                    }}
                    className="group relative overflow-hidden rounded-xl border-2 border-[#d4af37]/40 bg-black/40 hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all p-4"
                  >
                    <div className="text-center">
                      <div className="w-full h-24 mb-3 rounded-lg bg-[#d4af37]/20 flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-1 w-20">
                          <div className="h-2 bg-[#d4af37]/60 rounded"></div>
                          <div className="h-2 bg-[#d4af37]/60 rounded"></div>
                          <div className="h-10 bg-[#d4af37]/60 rounded row-span-2"></div>
                          <div className="h-7 bg-[#d4af37]/60 rounded"></div>
                          <div className="h-7 bg-[#d4af37]/60 rounded"></div>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-[#d4af37]">Wide</p>
                      <p className="text-xs text-white/50 mt-1">Horizontal spread</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onApplyLayoutPreset('balanced');
                      onClose();
                    }}
                    className="group relative overflow-hidden rounded-xl border-2 border-[#d4af37]/40 bg-black/40 hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all p-4"
                  >
                    <div className="text-center">
                      <div className="w-full h-24 mb-3 rounded-lg bg-[#d4af37]/20 flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-1 w-20">
                          <div className="h-4 bg-[#d4af37]/60 rounded"></div>
                          <div className="h-4 bg-[#d4af37]/60 rounded"></div>
                          <div className="h-4 bg-[#d4af37]/60 rounded"></div>
                          <div className="h-7 bg-[#d4af37]/60 rounded"></div>
                          <div className="h-7 bg-[#d4af37]/60 rounded"></div>
                          <div className="h-7 bg-[#d4af37]/60 rounded"></div>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-[#d4af37]">Balanced</p>
                      <p className="text-xs text-white/50 mt-1">Even distribution</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Theme */}
              <div>
                <h3 className="text-lg font-semibold text-[#d4af37] mb-4 flex items-center gap-2">
                  {isMidnight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  Theme
                </h3>
                <button
                  onClick={onToggleMidnight}
                  className={`w-full px-6 py-4 rounded-xl text-base font-medium transition-all ${
                    isMidnight
                      ? 'bg-[#1a120d] border-2 border-[#d4af37] text-[#d4af37]'
                      : 'bg-[#d4af37]/20 border-2 border-[#d4af37]/40 text-[#ddc3a5] hover:border-[#d4af37]/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Midnight Mode</span>
                    <div className={`w-12 h-6 rounded-full relative transition-colors ${
                      isMidnight ? 'bg-[#d4af37]' : 'bg-white/20'
                    }`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        isMidnight ? 'right-1' : 'left-1'
                      }`} />
                    </div>
                  </div>
                </button>
              </div>

              {/* Background */}
              <div>
                <h3 className="text-lg font-semibold text-[#d4af37] mb-4 flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Background
                </h3>
                <div className="space-y-3">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      className="hidden"
                      id="background-upload"
                    />
                    <div className="w-full px-6 py-4 rounded-xl text-base font-medium bg-[#d4af37]/20 border-2 border-[#d4af37]/40 text-[#ddc3a5] hover:border-[#d4af37]/60 hover:bg-[#d4af37]/30 transition-all cursor-pointer text-center">
                      Upload Image
                    </div>
                  </label>
                  <button
                    onClick={handleRemoveBackground}
                    className="w-full px-6 py-4 rounded-xl text-base font-medium bg-red-900/20 border-2 border-red-500/40 text-red-300 hover:border-red-500/60 hover:bg-red-900/30 transition-all"
                  >
                    Remove Background
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t-2 border-[#d4af37]/20 bg-black/20">
              <p className="text-sm text-white/50 text-center" style={{ fontFamily: 'Lora, Georgia, serif' }}>
                <strong className="text-[#d4af37]">Tip:</strong> Use "Edit Layout" mode to freely drag and resize components. Components snap to 8ths of the screen for perfect alignment.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
