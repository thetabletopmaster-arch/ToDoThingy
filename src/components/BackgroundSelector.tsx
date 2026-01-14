import { useState, useRef } from 'react';
import { Image, Link as LinkIcon, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BACKGROUND_KEY = 'productivity-dashboard-background';

interface BackgroundSelectorProps {
  onBackgroundChange: (backgroundUrl: string | null) => void;
}

export default function BackgroundSelector({ onBackgroundChange }: BackgroundSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      localStorage.setItem(BACKGROUND_KEY, imageUrl);
      onBackgroundChange(imageUrl);
      setImageUrl('');
      setIsOpen(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        localStorage.setItem(BACKGROUND_KEY, dataUrl);
        onBackgroundChange(dataUrl);
        setIsOpen(false);
      };
      reader.readAsDataURL(file);
    }
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
            className="absolute top-14 right-0 w-80 glass-effect rounded-xl p-4 shadow-2xl"
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

            <div className="space-y-4">
              {/* Upload Image */}
              <div>
                <label className="text-sm font-medium text-[#d4af37] mb-2 block">
                  Upload Image
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#d4af37]/40 bg-black/40 text-[#ddc3a5] hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Choose Image File
                </button>
              </div>

              {/* Or Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#d4af37]/30"></div>
                <span className="text-xs text-[#d4af37]/60">OR</span>
                <div className="flex-1 h-px bg-[#d4af37]/30"></div>
              </div>

              {/* Image URL */}
              <form onSubmit={handleUrlSubmit}>
                <label className="text-sm font-medium text-[#d4af37] mb-2 block">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 rounded-lg border-2 border-[#d4af37]/40 focus:outline-none focus:border-[#d4af37] bg-black/40 text-[#ddc3a5] placeholder-[#d4af37]/30 text-sm transition-all"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#d4af37] text-[#1a120d] font-medium hover:bg-[#cd7f32] transition-all shadow-md"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 rounded-lg bg-[#cd7f32] text-[#1a120d] font-medium hover:bg-[#b8941e] transition-all shadow-md"
              >
                Reset to Default
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
