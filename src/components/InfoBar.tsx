import { useState, useEffect } from 'react';
import { Clock, Cloud, Sunrise, Sunset, Sun, Droplets, Wind, Clock12, Clock3 } from 'lucide-react';
import LocationSelector from './LocationSelector';

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
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

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

  useEffect(() => {
    if (coordinates) {
      // Check cache first
      const cached = getCachedWeather(coordinates);
      if (cached) {
        console.log('Using cached weather data');
        setWeather(cached.data.weather);
        setSunTimes(cached.data.sunTimes);
        setTimezone(cached.data.timezone);
      } else {
        fetchWeatherData(coordinates.lat, coordinates.lon);
      }
    }
  }, [coordinates]);

  const getCachedWeather = (coords: { lat: number; lon: number }): WeatherCache | null => {
    try {
      const cached = localStorage.getItem(WEATHER_CACHE_KEY);
      if (!cached) return null;

      const cacheData: WeatherCache = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid (within 10 minutes) and for same location
      if (
        now - cacheData.timestamp < CACHE_DURATION &&
        Math.abs(cacheData.coordinates.lat - coords.lat) < 0.01 &&
        Math.abs(cacheData.coordinates.lon - coords.lon) < 0.01
      ) {
        return cacheData;
      }

      return null;
    } catch {
      return null;
    }
  };

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    if (isLoading) {
      console.log('Already fetching weather, skipping...');
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

      console.log('Weather state updated and cached successfully');
    } catch (error) {
      console.error('Error fetching weather data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (lat: number, lon: number, name: string) => {
    console.log('Location changed:', { name, lat, lon });
    setCoordinates({ lat, lon });
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

  return (
    <div className="space-y-3">
      {/* Location Selector */}
      <LocationSelector onLocationChange={handleLocationChange} isMidnight={isMidnight} />

      {/* Coordinates Display */}
      {coordinates && (
        <div className="glass-effect rounded-xl p-3 shadow-glow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs text-white/60">Latitude</span>
                <div className="text-base font-bold text-white">{coordinates.lat.toFixed(4)}°</div>
              </div>
              <div>
                <span className="text-xs text-white/60">Longitude</span>
                <div className="text-base font-bold text-white">{coordinates.lon.toFixed(4)}°</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Time */}
        <div className="glass-effect rounded-xl p-4 shadow-glow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-white/80" />
              <span className="text-sm font-medium text-white/80">Local Time</span>
            </div>
            <button
              onClick={toggleTimeFormat}
              className="text-white/60 hover:text-white transition-colors"
              title={is24Hour ? 'Switch to 12-hour format' : 'Switch to 24-hour format'}
            >
              {is24Hour ? <Clock3 className="w-4 h-4" /> : <Clock12 className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-3xl font-bold tabular-nums text-white mb-1">
            {formatTime(time)}
          </div>
          <div className="text-sm text-white/70">
            {formatDate(time)}
          </div>
          {timezone && (
            <div className="text-xs text-white/50 mt-1">
              {timezone}
            </div>
          )}
        </div>

        {/* UV Index - Prominent Display */}
        <div className="glass-effect rounded-xl p-4 shadow-glow">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-4 h-4 text-white/80" />
            <span className="text-sm font-medium text-white/80">UV Radiation</span>
          </div>
          {isLoading ? (
            <div className="text-sm text-white/60">Loading...</div>
          ) : weather ? (
            <>
              <div className="text-4xl font-bold text-white mb-2">
                {weather.uvIndex}
              </div>
              <div className="text-base font-medium text-white/90 mb-2">
                {uvInfo?.level}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-white/70">UVA + UVB Radiation</span>
                <span className="text-xs text-white/60">
                  {weather.uvIndex <= 2 && "Minimal protection needed"}
                  {weather.uvIndex > 2 && weather.uvIndex <= 5 && "Moderate protection advised"}
                  {weather.uvIndex > 5 && weather.uvIndex <= 7 && "High protection required"}
                  {weather.uvIndex > 7 && "Extreme - Seek shade"}
                </span>
              </div>
            </>
          ) : (
            <div className="text-sm text-white/60">Select location</div>
          )}
        </div>

        {/* Weather */}
        <div className="glass-effect rounded-xl p-4 shadow-glow">
          <div className="flex items-center gap-2 mb-2">
            <Cloud className="w-4 h-4 text-white/80" />
            <span className="text-sm font-medium text-white/80">Current Weather</span>
          </div>
          {isLoading ? (
            <div className="text-sm text-white/60">Loading...</div>
          ) : weather ? (
            <>
              <div className="text-4xl font-bold text-white mb-3">
                {weather.temperature}°C
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-white/70" />
                  <span className="text-sm text-white/90">Humidity:</span>
                  <span className="text-sm font-medium text-white">{weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-white/70" />
                  <span className="text-sm text-white/90">Wind:</span>
                  <span className="text-sm font-medium text-white">{weather.windSpeed} km/h</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-white/60">Select location</div>
          )}
        </div>

        {/* Sun Times */}
        <div className="glass-effect rounded-xl p-4 shadow-glow">
          <div className="flex items-center gap-2 mb-3">
            <Sun className="w-4 h-4 text-white/80" />
            <span className="text-sm font-medium text-white/80">Sunrise & Sunset</span>
          </div>
          {isLoading ? (
            <div className="text-sm text-white/60">Loading...</div>
          ) : sunTimes ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sunrise className="w-4 h-4 text-white/70" />
                  <span className="text-sm text-white/80">Sunrise</span>
                </div>
                <div className="text-2xl font-bold tabular-nums text-white mb-1">
                  {sunTimes.sunrise}
                </div>
                {getHoursUntil(sunTimes.sunriseDate) && (
                  <div className="text-sm text-white/70">
                    In {getHoursUntil(sunTimes.sunriseDate)}
                  </div>
                )}
                {!getHoursUntil(sunTimes.sunriseDate) && (
                  <div className="text-sm text-white/70">Already passed today</div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sunset className="w-4 h-4 text-white/70" />
                  <span className="text-sm text-white/80">Sunset</span>
                </div>
                <div className="text-2xl font-bold tabular-nums text-white mb-1">
                  {sunTimes.sunset}
                </div>
                {getHoursUntil(sunTimes.sunsetDate) && (
                  <div className="text-sm text-white/70">
                    In {getHoursUntil(sunTimes.sunsetDate)}
                  </div>
                )}
                {!getHoursUntil(sunTimes.sunsetDate) && (
                  <div className="text-sm text-white/70">Already passed today</div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-sm text-white/60">Select location</div>
          )}
        </div>
      </div>
    </div>
  );
}
