import { useState, useEffect, useCallback } from 'react';
import { Clock, Cloud, Sunrise, Sunset, Sun, Droplets, Wind, Clock12, Clock3, Wifi, WifiOff } from 'lucide-react';
import LocationSelector from './LocationSelector';
import PhilosophyQuote from './PhilosophyQuote';

interface WeatherData {
  temperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
}

interface SunTimes {
  sunrise: string;
  sunset: string;
  sunriseDate: Date;
  sunsetDate: Date;
}

const TIME_FORMAT_KEY = 'productivity-dashboard-time-format';
const WEATHER_CACHE_KEY = 'productivity-dashboard-weather-cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds (increased to avoid rate limits)

interface WeatherCache {
  data: {
    weather: WeatherData;
    sunTimes: SunTimes;
    timezone: string;
  };
  timestamp: number;
  coordinates: { lat: number; lon: number };
}

interface InfoBarProps {
  isMidnight: boolean;
}

export default function InfoBar({ isMidnight }: InfoBarProps) {
  const [time, setTime] = useState(new Date());
  const [timezone, setTimezone] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [sunTimes, setSunTimes] = useState<SunTimes | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionSpeed, setConnectionSpeed] = useState<string>('Checking...');
  const [is24Hour, setIs24Hour] = useState(() => {
    const stored = localStorage.getItem(TIME_FORMAT_KEY);
    return stored === 'true';
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(TIME_FORMAT_KEY, String(is24Hour));
  }, [is24Hour]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('InfoBar: Connection restored');
      setIsOnline(true);
      checkConnectionSpeed();
    };
    const handleOffline = () => {
      console.log('InfoBar: Connection lost');
      setIsOnline(false);
      setConnectionSpeed('No connection');
      setError('No internet connection');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial connection speed check
    if (navigator.onLine) {
      checkConnectionSpeed();
    } else {
      setConnectionSpeed('No connection');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkConnectionSpeed = () => {
    // Use Network Information API if available
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    if (connection && connection.effectiveType) {
      const typeMap: { [key: string]: string } = {
        'slow-2g': 'Very Slow',
        '2g': 'Slow',
        '3g': 'Moderate',
        '4g': 'Fast'
      };
      setConnectionSpeed(typeMap[connection.effectiveType] || connection.effectiveType);

      if (connection.downlink) {
        setConnectionSpeed(`${connection.downlink} Mbps`);
      }
    } else {
      // Fallback: estimate based on a quick fetch
      const startTime = performance.now();
      fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' })
        .then(() => {
          const duration = performance.now() - startTime;
          if (duration < 100) setConnectionSpeed('Fast');
          else if (duration < 300) setConnectionSpeed('Moderate');
          else setConnectionSpeed('Slow');
        })
        .catch(() => {
          setConnectionSpeed('Unknown');
        });
    }
  };

  useEffect(() => {
    console.log('InfoBar: Coordinates changed:', coordinates);
    if (coordinates) {
      // Check cache first
      const cached = getCachedWeather(coordinates);
      if (cached) {
        console.log('InfoBar: Using cached weather data:', cached.data);
        setWeather(cached.data.weather);
        // Convert date strings back to Date objects
        const sunTimesWithDates: SunTimes = {
          ...cached.data.sunTimes,
          sunriseDate: new Date(cached.data.sunTimes.sunriseDate),
          sunsetDate: new Date(cached.data.sunTimes.sunsetDate),
        };
        setSunTimes(sunTimesWithDates);
        setTimezone(cached.data.timezone);
        setError(null); // Clear any errors
        console.log('InfoBar: State updated from cache');
      } else {
        console.log('InfoBar: No valid cache, fetching weather data');
        fetchWeatherData(coordinates.lat, coordinates.lon);
      }
    } else {
      console.log('InfoBar: No coordinates set yet');
    }
  }, [coordinates]);

  const getCachedWeather = (coords: { lat: number; lon: number }): WeatherCache | null => {
    try {
      const cached = localStorage.getItem(WEATHER_CACHE_KEY);
      if (!cached) {
        console.log('InfoBar: No cached weather in localStorage');
        return null;
      }

      const cacheData: WeatherCache = JSON.parse(cached);
      const now = Date.now();
      const cacheAge = now - cacheData.timestamp;
      const latDiff = Math.abs(cacheData.coordinates.lat - coords.lat);
      const lonDiff = Math.abs(cacheData.coordinates.lon - coords.lon);

      console.log('InfoBar: Cache check:', {
        cacheAge: `${Math.floor(cacheAge / 1000)}s`,
        maxAge: `${CACHE_DURATION / 1000}s`,
        latDiff,
        lonDiff,
        isValid: cacheAge < CACHE_DURATION && latDiff < 0.01 && lonDiff < 0.01
      });

      // Check if cache is still valid (within 10 minutes) and for same location
      if (
        now - cacheData.timestamp < CACHE_DURATION &&
        latDiff < 0.01 &&
        lonDiff < 0.01
      ) {
        console.log('InfoBar: Cache is valid, returning cached data');
        return cacheData;
      }

      console.log('InfoBar: Cache expired or location changed');
      return null;
    } catch (error) {
      console.error('InfoBar: Error reading cache:', error);
      return null;
    }
  };

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    if (isLoading) {
      console.log('Already fetching weather, skipping...');
      return;
    }

    // Check internet connection first
    if (!navigator.onLine) {
      console.log('InfoBar: No internet connection, skipping fetch');
      setError('No internet connection');
      return;
    }

    console.log('Fetching weather for:', { latitude, longitude });
    setIsLoading(true);

    try {
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=uv_index_max,sunrise,sunset&timezone=auto`
      );

      if (!weatherResponse.ok) {
        if (weatherResponse.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        throw new Error(`HTTP error! status: ${weatherResponse.status}`);
      }

      const weatherData = await weatherResponse.json();
      console.log('Weather data received:', weatherData);

      const weatherObj: WeatherData = {
        temperature: Math.round(weatherData.current.temperature_2m),
        weatherCode: weatherData.current.weather_code,
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: Math.round(weatherData.current.wind_speed_10m),
        uvIndex: Math.round(weatherData.daily.uv_index_max[0] || 0),
      };

      const sunrise = new Date(weatherData.daily.sunrise[0]);
      const sunset = new Date(weatherData.daily.sunset[0]);

      const sunTimesObj: SunTimes = {
        sunrise: sunrise.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        sunset: sunset.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        sunriseDate: sunrise,
        sunsetDate: sunset,
      };

      // Store timezone
      const tz = weatherData.timezone || null;
      console.log('InfoBar: Setting weather state:', { weather: weatherObj, sunTimes: sunTimesObj, timezone: tz });
      setTimezone(tz);
      setWeather(weatherObj);
      setSunTimes(sunTimesObj);

      // Cache the data
      const cacheData: WeatherCache = {
        data: {
          weather: weatherObj,
          sunTimes: sunTimesObj,
          timezone: tz,
        },
        timestamp: Date.now(),
        coordinates: { lat: latitude, lon: longitude },
      };
      localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(cacheData));

      console.log('InfoBar: Weather state updated and cached successfully');
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching weather data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = useCallback((lat: number, lon: number, name: string) => {
    console.log('InfoBar: Location changed:', { name, lat, lon });
    console.log('InfoBar: Setting coordinates to:', { lat, lon });
    setCoordinates({ lat, lon });
  }, []);

  const handleRetry = () => {
    console.log('InfoBar: Manual retry requested');
    if (coordinates) {
      setError(null);
      fetchWeatherData(coordinates.lat, coordinates.lon);
    }
  };

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !is24Hour,
      ...(timezone && { timeZone: timezone })
    };
    return date.toLocaleTimeString('en-US', options);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      ...(timezone && { timeZone: timezone })
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getHoursUntil = (targetDate: Date) => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours < 0) {
      return null; // Event has passed
    }

    if (hours === 0) {
      return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
  };

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low', color: isMidnight ? 'text-green-400' : 'text-green-400' };
    if (uv <= 5) return { level: 'Mod', color: isMidnight ? 'text-yellow-300' : 'text-yellow-400' };
    if (uv <= 7) return { level: 'High', color: isMidnight ? 'text-orange-300' : 'text-[#cd7f32]' };
    return { level: 'Extreme', color: isMidnight ? 'text-red-300' : 'text-red-400' };
  };

  const uvInfo = weather ? getUVLevel(weather.uvIndex) : null;

  const toggleTimeFormat = () => {
    setIs24Hour(!is24Hour);
  };

  // Debug: log current state
  console.log('InfoBar: Current state:', {
    hasCoordinates: !!coordinates,
    hasWeather: !!weather,
    hasSunTimes: !!sunTimes,
    isLoading,
    timezone
  });

  return (
    <div className="space-y-3">
      {/* Location Selector */}
      <LocationSelector
        onLocationChange={handleLocationChange}
        isMidnight={isMidnight}
        isOnline={isOnline}
        connectionSpeed={connectionSpeed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Combined Location Info */}
        <div className="glass-effect rounded-xl p-3 shadow-glow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Time Section */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-white/80" />
                  <span className="text-xs font-medium text-white/80">Time</span>
                </div>
                <button
                  onClick={toggleTimeFormat}
                  className="text-white/60 hover:text-white transition-colors"
                  title={is24Hour ? 'Switch to 12-hour format' : 'Switch to 24-hour format'}
                >
                  {is24Hour ? <Clock3 className="w-3 h-3" /> : <Clock12 className="w-3 h-3" />}
                </button>
              </div>
              <div className="text-lg font-bold tabular-nums text-white">
                {formatTime(time)}
              </div>
              <div className="text-xs text-white/70">{formatDate(time)}</div>
              {timezone && <div className="text-xs text-white/50">{timezone}</div>}
              {coordinates && (
                <div className="flex gap-2 mt-1 text-xs">
                  <span className="text-white/50">Lat: {coordinates.lat.toFixed(2)}°</span>
                  <span className="text-white/50">Lon: {coordinates.lon.toFixed(2)}°</span>
                </div>
              )}
            </div>

            {/* Weather Section */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Cloud className="w-3 h-3 text-white/80" />
                <span className="text-xs font-medium text-white/80">Weather</span>
              </div>
              {isLoading ? (
                <div className="text-xs text-white/60">Loading...</div>
              ) : error ? (
                <div>
                  <div className="text-xs text-red-400">
                    {!isOnline ? 'No connection' : 'Error'}
                  </div>
                  {isOnline && (
                    <button
                      onClick={handleRetry}
                      className="text-xs px-2 py-1 mt-1 rounded bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/30"
                    >
                      Retry
                    </button>
                  )}
                </div>
              ) : weather ? (
                <>
                  <div className="text-xl font-bold text-white">{weather.temperature}°C</div>
                  <div className="text-xs text-white/70 mb-1">UV: {weather.uvIndex} ({uvInfo?.level})</div>
                  <div className="flex gap-2 text-xs text-white/60">
                    <span><Droplets className="w-3 h-3 inline mr-1" />{weather.humidity}%</span>
                    <span><Wind className="w-3 h-3 inline mr-1" />{weather.windSpeed}km/h</span>
                  </div>
                </>
              ) : (
                <div className="text-xs text-white/60">Select location</div>
              )}
            </div>

            {/* Sun Times Section */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Sun className="w-3 h-3 text-white/80" />
                <span className="text-xs font-medium text-white/80">Sun</span>
              </div>
              {isLoading ? (
                <div className="text-xs text-white/60">Loading...</div>
              ) : error ? (
                <div className="text-xs text-red-400">Error</div>
              ) : sunTimes ? (
                <div className="space-y-1">
                  <div>
                    <div className="flex items-center gap-1">
                      <Sunrise className="w-3 h-3 text-white/60" />
                      <span className="text-sm font-bold text-white">{sunTimes.sunrise}</span>
                    </div>
                    {getHoursUntil(sunTimes.sunriseDate) && (
                      <div className="text-xs text-white/50">In {getHoursUntil(sunTimes.sunriseDate)}</div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Sunset className="w-3 h-3 text-white/60" />
                      <span className="text-sm font-bold text-white">{sunTimes.sunset}</span>
                    </div>
                    {getHoursUntil(sunTimes.sunsetDate) && (
                      <div className="text-xs text-white/50">In {getHoursUntil(sunTimes.sunsetDate)}</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-white/60">Select location</div>
              )}
            </div>
          </div>
        </div>

        {/* Daily Quote */}
        <PhilosophyQuote isMidnight={isMidnight} />
      </div>
    </div>
  );
}
