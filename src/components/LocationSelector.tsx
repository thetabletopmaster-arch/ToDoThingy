import { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationOption {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string;
}

interface LocationSelectorProps {
  onLocationChange: (lat: number, lon: number, name: string) => void;
  isMidnight: boolean;
}

const LOCATION_KEY = 'productivity-dashboard-location';

export default function LocationSelector({ onLocationChange, isMidnight: _isMidnight }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<LocationOption[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCATION_KEY);
    if (stored) {
      try {
        const { name, latitude, longitude } = JSON.parse(stored);
        setSelectedLocation(name);
        onLocationChange(latitude, longitude, name);
      } catch {
        // If parsing fails, use geolocation
        getGeolocation();
      }
    } else {
      getGeolocation();
    }
  }, []);

  const getGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation('Current Location');
          onLocationChange(latitude, longitude, 'Current Location');
        },
        () => {
          setSelectedLocation('Location Unknown');
        }
      );
    }
  };

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
      );
      const data = await response.json();

      if (data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchLocations(searchQuery);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const selectLocation = (location: LocationOption) => {
    const displayName = `${location.name}, ${location.country}`;
    setSelectedLocation(displayName);
    setIsOpen(false);
    setSearchQuery('');
    setResults([]);

    localStorage.setItem(
      LOCATION_KEY,
      JSON.stringify({
        name: displayName,
        latitude: location.latitude,
        longitude: location.longitude,
      })
    );

    onLocationChange(location.latitude, location.longitude, displayName);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg border-2 border-[#d4af37]/40 bg-black/40 text-[#ddc3a5] hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-all"
      >
        <MapPin className="w-3 h-3" />
        <span className="text-xs">{selectedLocation || 'Select Location'}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 glass-effect rounded-lg p-3 z-50 min-w-[300px]"
          >
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-[#d4af37]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city..."
                className="flex-1 px-3 py-2 rounded-lg border-2 border-[#d4af37]/40 focus:outline-none focus:border-[#d4af37] bg-black/40 text-[#ddc3a5] placeholder-amber-500/30 transition-all"
                autoFocus
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-1">
              {isSearching && (
                <div className="text-center py-4 text-[#d4af37]/50">Searching...</div>
              )}

              {!isSearching && results.length === 0 && searchQuery && (
                <div className="text-center py-4 text-[#d4af37]/50">No results found</div>
              )}

              {!isSearching && results.length === 0 && !searchQuery && (
                <div className="text-center py-4 text-[#d4af37]/50">
                  Type to search for a city
                </div>
              )}

              {results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => selectLocation(result)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#d4af37]/10 border border-transparent hover:border-[#d4af37]/40 transition-all"
                >
                  <div className="text-sm font-medium text-[#ddc3a5]">
                    {result.name}
                  </div>
                  <div className="text-xs text-[#d4af37]/60">
                    {result.admin1 && `${result.admin1}, `}{result.country}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
