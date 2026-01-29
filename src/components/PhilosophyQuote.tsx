import { useState } from 'react';
import { Quote, RefreshCw } from 'lucide-react';

const quotes = [
  // Marcus Aurelius - Meditations
  { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "If it is not right, do not do it. If it is not true, do not say it.", author: "Marcus Aurelius" },
  { text: "Very little is needed to make a happy life; it is all within yourself.", author: "Marcus Aurelius" },
  { text: "The best revenge is to be unlike him who performed the injury.", author: "Marcus Aurelius" },
  { text: "Accept the things to which fate binds you, and love the people with whom fate brings you together.", author: "Marcus Aurelius" },
  { text: "The obstacle is the way.", author: "Marcus Aurelius" },
  { text: "Do not act as if you were going to live ten thousand years. Death hangs over you.", author: "Marcus Aurelius" },
  { text: "When you arise in the morning, think of what a precious privilege it is to be alive.", author: "Marcus Aurelius" },

  // Friedrich Nietzsche
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "That which does not kill us makes us stronger.", author: "Friedrich Nietzsche" },
  { text: "To live is to suffer, to survive is to find some meaning in the suffering.", author: "Friedrich Nietzsche" },
  { text: "The individual has always had to struggle to keep from being overwhelmed by the tribe.", author: "Friedrich Nietzsche" },
  { text: "No one can construct for you the bridge upon which precisely you must cross the stream of life.", author: "Friedrich Nietzsche" },
  { text: "Become who you are.", author: "Friedrich Nietzsche" },
  { text: "The higher we soar the smaller we appear to those who cannot fly.", author: "Friedrich Nietzsche" },
  { text: "In individuals, insanity is rare; but in groups, parties, nations and epochs, it is the rule.", author: "Friedrich Nietzsche" },
  { text: "The thought of suicide is a great consolation: by means of it one gets through many a dark night.", author: "Friedrich Nietzsche" },
  { text: "Without music, life would be a mistake.", author: "Friedrich Nietzsche" },

  // Gorn Karg
  { text: "If you're brave enough to say goodbye life will reward you with a new hello.", author: "Gorn Karg" },
  { text: "Every act of beauty is a revolt against the modern world, be beautiful be godly.", author: "Gorn Karg" }
];

const QUOTE_KEY = 'productivity-dashboard-daily-quote';
const QUOTE_DATE_KEY = 'productivity-dashboard-quote-date';

export default function PhilosophyQuote({ isMidnight: _isMidnight }: { isMidnight: boolean }) {
  const [quote, setQuote] = useState(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem(QUOTE_DATE_KEY);
    const storedQuote = localStorage.getItem(QUOTE_KEY);

    if (storedDate === today && storedQuote) {
      return JSON.parse(storedQuote);
    }

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    localStorage.setItem(QUOTE_KEY, JSON.stringify(randomQuote));
    localStorage.setItem(QUOTE_DATE_KEY, today);
    return randomQuote;
  });

  const getNewQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    const today = new Date().toDateString();
    localStorage.setItem(QUOTE_KEY, JSON.stringify(randomQuote));
    localStorage.setItem(QUOTE_DATE_KEY, today);
  };

  return (
    <div className="glass-effect rounded-xl p-3 shadow-glow h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Quote className="w-3 h-3 text-[#d4af37]" />
          <h3 className="text-xs font-medium text-[#d4af37]" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
            Daily Wisdom
          </h3>
        </div>
        <button
          onClick={getNewQuote}
          className="text-[#d4af37]/60 hover:text-[#d4af37] transition-colors p-1 rounded hover:bg-[#d4af37]/10"
          title="New quote"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      <blockquote className="relative flex-1 flex flex-col justify-center">
        <p className="text-sm text-[#ddc3a5] italic leading-relaxed mb-2" style={{ fontFamily: 'Lora, Georgia, serif' }}>
          "{quote.text}"
        </p>
        <footer className="text-sm text-[#d4af37]/80" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
          — {quote.author}
        </footer>
      </blockquote>
    </div>
  );
}
