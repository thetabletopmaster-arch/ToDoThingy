import { useState, useEffect } from 'react';
import { Scroll } from 'lucide-react';

const NOTES_KEY = 'productivity-dashboard-notes';

export default function Notes({ isMidnight }: { isMidnight: boolean }) {
  const [notes, setNotes] = useState(() => {
    const stored = localStorage.getItem(NOTES_KEY);
    return stored || '';
  });

  useEffect(() => {
    localStorage.setItem(NOTES_KEY, notes);
  }, [notes]);

  return (
    <div className="glass-effect rounded-xl p-4 shadow-glow h-full">
      <div className="flex items-center gap-2 mb-3">
        <Scroll className="w-5 h-5 text-[#d4af37]" />
        <h3 className="text-lg font-semibold text-[#d4af37]" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
          Scrolls & Notes
        </h3>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your thoughts, plans, and wisdom here..."
        className="w-full h-[calc(100%-3rem)] px-4 py-3 rounded-lg border-2 border-[#d4af37]/30 focus:outline-none focus:border-[#d4af37] bg-black/40 text-[#ddc3a5] placeholder-[#d4af37]/30 resize-none transition-all"
        style={{
          fontFamily: 'Lora, Georgia, serif',
          lineHeight: '1.8'
        }}
      />
    </div>
  );
}
