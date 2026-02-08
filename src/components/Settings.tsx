import { X, Moon, Sun, Image, Layout, Eye, EyeOff, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ComponentStyle {
  backgroundColor?: string;
  opacity?: number;
}

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isMidnight: boolean;
  onToggleMidnight: () => void;
  onBackgroundChange: (background: string | null) => void;
  onApplyLayoutPreset: (preset: 'compact' | 'wide' | 'balanced') => void;
  componentVisibility: { [key: string]: boolean };
  onToggleVisibility: (id: string) => void;
  componentStyles: { [key: string]: ComponentStyle };
  onUpdateStyle: (id: string, style: ComponentStyle) => void;
}

const componentNames: { [key: string]: string } = {
  'quick-links': 'Quick Links',
  'info-bar': 'Location Info',
  'daily-quote': 'Daily Quote',
  'task-list': 'Goals Wall',
  'timer': 'Timer',
  'crypto': 'Bitcoin Price',
  'music': 'Music Player',
  'notes': 'Notes',
};

export default function Settings({
  isOpen,
  onClose,
  isMidnight,
  onToggleMidnight,
  onBackgroundChange,
  onApplyLayoutPreset,
  componentVisibility,
  onToggleVisibility,
  componentStyles,
  onUpdateStyle,
}: SettingsProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
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
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Layout Presets */}
              <div>
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
                      <div className="w-full h-28 mb-3 rounded-lg bg-gradient-to-br from-[#d4af37]/10 to-black/60 p-2 flex items-center justify-center">
                        <div className="w-full h-full grid grid-cols-3 gap-1">
                          <div className="col-span-3 h-2 bg-[#d4af37]/70 rounded"></div>
                          <div className="col-span-2 h-5 bg-[#d4af37]/60 rounded"></div>
                          <div className="col-span-1 h-5 bg-[#d4af37]/50 rounded"></div>
                          <div className="col-span-2 h-12 bg-[#d4af37]/60 rounded"></div>
                          <div className="col-span-1 space-y-1">
                            <div className="h-5 bg-[#d4af37]/50 rounded"></div>
                            <div className="h-3 bg-[#d4af37]/40 rounded"></div>
                            <div className="h-2 bg-[#d4af37]/30 rounded"></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-[#d4af37]">Compact</p>
                      <p className="text-xs text-white/50 mt-1">Dense & efficient</p>
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
                      <div className="w-full h-28 mb-3 rounded-lg bg-gradient-to-br from-[#d4af37]/10 to-black/60 p-2 flex items-center justify-center">
                        <div className="w-full h-full grid grid-cols-5 gap-1">
                          <div className="col-span-5 h-2 bg-[#d4af37]/70 rounded"></div>
                          <div className="col-span-2 h-6 bg-[#d4af37]/60 rounded"></div>
                          <div className="col-span-2 h-6 bg-[#d4af37]/50 rounded"></div>
                          <div className="col-span-1 row-span-2 h-full bg-[#d4af37]/60 rounded"></div>
                          <div className="col-span-1 h-5 bg-[#d4af37]/50 rounded"></div>
                          <div className="col-span-2 space-y-1">
                            <div className="h-2 bg-[#d4af37]/40 rounded"></div>
                            <div className="h-1 bg-[#d4af37]/30 rounded"></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-[#d4af37]">Wide</p>
                      <p className="text-xs text-white/50 mt-1">Ultrawide panorama</p>
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
                      <div className="w-full h-28 mb-3 rounded-lg bg-gradient-to-br from-[#d4af37]/10 to-black/60 p-2 flex items-center justify-center">
                        <div className="w-full h-full grid grid-cols-4 gap-1">
                          <div className="col-start-2 col-span-2 h-2 bg-[#d4af37]/70 rounded"></div>
                          <div className="col-span-2 h-5 bg-[#d4af37]/60 rounded"></div>
                          <div className="col-span-2 h-5 bg-[#d4af37]/50 rounded"></div>
                          <div className="col-span-1 space-y-1">
                            <div className="h-4 bg-[#d4af37]/50 rounded"></div>
                            <div className="h-2 bg-[#d4af37]/40 rounded"></div>
                          </div>
                          <div className="col-span-2 h-10 bg-[#d4af37]/60 rounded"></div>
                          <div className="col-span-1 h-10 bg-[#d4af37]/50 rounded"></div>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-[#d4af37]">Balanced</p>
                      <p className="text-xs text-white/50 mt-1">Golden harmony</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Component Visibility */}
              <div>
                <h3 className="text-lg font-semibold text-[#d4af37] mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Show/Hide Components
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(componentNames).map((id) => (
                    <button
                      key={id}
                      onClick={() => onToggleVisibility(id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        componentVisibility[id]
                          ? 'bg-[#d4af37]/20 border-2 border-[#d4af37]/60 text-[#d4af37]'
                          : 'bg-black/40 border-2 border-white/20 text-white/40'
                      }`}
                    >
                      {componentVisibility[id] ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                      {componentNames[id]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Component Customization */}
              <div>
                <h3 className="text-lg font-semibold text-[#d4af37] mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Customize Components
                </h3>
                <div className="space-y-3">
                  <select
                    value={selectedComponent || ''}
                    onChange={(e) => setSelectedComponent(e.target.value || null)}
                    className="w-full px-4 py-2 rounded-lg bg-black/40 border-2 border-[#d4af37]/40 text-white"
                  >
                    <option value="">Select a component...</option>
                    {Object.keys(componentNames).map((id) => (
                      <option key={id} value={id}>
                        {componentNames[id]}
                      </option>
                    ))}
                  </select>

                  {selectedComponent && (
                    <div className="space-y-3 p-4 rounded-lg bg-black/40 border-2 border-[#d4af37]/40">
                      <div>
                        <label className="text-sm text-white/80 mb-2 block">Background Color</label>
                        <input
                          type="color"
                          value={componentStyles[selectedComponent]?.backgroundColor || '#000000'}
                          onChange={(e) =>
                            onUpdateStyle(selectedComponent, {
                              ...componentStyles[selectedComponent],
                              backgroundColor: e.target.value,
                            })
                          }
                          className="w-full h-10 rounded-lg border-2 border-[#d4af37]/40 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-white/80 mb-2 block">
                          Transparency: {Math.round((componentStyles[selectedComponent]?.opacity || 1) * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={componentStyles[selectedComponent]?.opacity || 1}
                          onChange={(e) =>
                            onUpdateStyle(selectedComponent, {
                              ...componentStyles[selectedComponent],
                              opacity: parseFloat(e.target.value),
                            })
                          }
                          className="w-full"
                        />
                      </div>

                      <button
                        onClick={() => {
                          onUpdateStyle(selectedComponent, {});
                          setSelectedComponent(null);
                        }}
                        className="w-full px-4 py-2 rounded-lg text-sm bg-red-900/20 border-2 border-red-500/40 text-red-300 hover:bg-red-900/30"
                      >
                        Reset to Default
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Theme and Background */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
