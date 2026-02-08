import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface CryptoPriceProps {
  isMidnight: boolean;
}

interface PriceData {
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
}

export default function CryptoPrice({ isMidnight }: CryptoPriceProps) {
  const [btcData, setBtcData] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_high=true&include_24hr_low=true'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch price');
      }

      const data = await response.json();

      setBtcData({
        price: data.bitcoin.usd,
        change24h: data.bitcoin.usd_24h_change,
        high24h: data.bitcoin.usd_24h_high,
        low24h: data.bitcoin.usd_24h_low,
      });
      setError(null);
    } catch (err) {
      setError('Failed to load price');
      console.error('Error fetching BTC price:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isPositive = btcData ? btcData.change24h > 0 : false;

  return (
    <div className="glass-effect rounded-xl p-4 shadow-glow h-full">
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="w-5 h-5 text-[#d4af37]" />
        <h3 className="text-lg font-bold text-[#d4af37]" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
          Bitcoin
        </h3>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-white/60">Loading...</div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-400 mb-2">{error}</div>
          <button
            onClick={fetchPrice}
            className="text-xs px-3 py-1 rounded bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/30"
          >
            Retry
          </button>
        </div>
      ) : btcData ? (
        <div className="space-y-3">
          {/* Current Price */}
          <div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatPrice(btcData.price)}
            </div>
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {isPositive ? '+' : ''}{btcData.change24h.toFixed(2)}%
              </span>
              <span className="text-white/50 text-xs ml-1">24h</span>
            </div>
          </div>

          {/* 24h High/Low */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t-2 border-white/10">
            <div>
              <div className="text-xs text-white/50 mb-1">24h High</div>
              <div className="text-sm font-semibold text-green-400">
                {formatPrice(btcData.high24h)}
              </div>
            </div>
            <div>
              <div className="text-xs text-white/50 mb-1">24h Low</div>
              <div className="text-sm font-semibold text-red-400">
                {formatPrice(btcData.low24h)}
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-white/40 text-center pt-2">
            Updates every minute
          </div>
        </div>
      ) : null}
    </div>
  );
}
