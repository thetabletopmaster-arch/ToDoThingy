import { useState } from 'react';
import { Image, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BACKGROUND_KEY = 'productivity-dashboard-background';

// Dynamically import all images from public/backgrounds folder
const backgroundImages = import.meta.glob('/public/backgrounds/*.(png|jpg|jpeg|gif|webp|svg)', { eager: true, query: '?url', import: 'default' });

interface BackgroundSelectorProps {
  onBackgroundChange: (backgroundUrl: string | null) => void;
}

export default function BackgroundSelector({ onBackgroundChange }: BackgroundSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get list of available backgrounds
  const availableBackgrounds = Object.entries(backgroundImages).map(([path, url]) => ({
    name: path.split('/').pop()?.split('.')[0] || 'Unnamed',
    url: url as string,
    path: path.replace('/public', '')
  }));

  const handleSelectBackground = (url: string) => {
    localStorage.setItem(BACKGROUND_KEY, url);
    onBackgroundChange(url);
    setIsOpen(false);
  };

  const handleReset = () => {
    localStorage.removeItem(BACKGROUND_KEY);
    onBackgroundChange(null);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-20 right-4 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#d4af37]/90 backdrop-blur-sm text-[#1a120d] p-3 rounded-full shadow-lg hover:bg-[#cd7f32] transition-all"
        title="Change Background"
      >
        <Image className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-14 right-0 w-96 glass-effect rounded-xl p-4 shadow-2xl max-h-[70vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#d4af37]" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
                Background Image
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#d4af37]/60 hover:text-[#d4af37] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#ddc3a5]/70 mb-4">
              Drop images in <code className="bg-black/40 px-2 py-0.5 rounded text-[#d4af37]">public/backgrounds/</code> folder
            </p>

            <div className="space-y-3">
              {availableBackgrounds.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    {availableBackgrounds.map((bg) => (
                      <button
                        key={bg.path}
                        onClick={() => handleSelectBackground(bg.path)}
                        className="relative group overflow-hidden rounded-lg border-2 border-[#d4af37]/40 hover:border-[#d4af37] transition-all aspect-video"
                      >
                        <img
                          src={bg.path}
                          alt={bg.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{bg.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={handleReset}
                    className="w-full px-4 py-2 rounded-lg bg-[#cd7f32] text-[#1a120d] font-medium hover:bg-[#b8941e] transition-all shadow-md"
                  >
                    Reset to Default
                  </button>
                </>
              ) : (
                <div className="text-center py-8 text-[#d4af37]/50 text-sm">
                  <p className="mb-2">No backgrounds found!</p>
                  <p className="text-xs">Add image files to the <code className="bg-black/40 px-2 py-0.5 rounded">public/backgrounds/</code> folder</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
