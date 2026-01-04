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

export default function InfoBar({ isMidnight }: { isMidnight: boolean }) {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [sunTimes, setSunTimes] = useState<SunTimes | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
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
      fetchWeatherData(coordinates.lat, coordinates.lon);
    }
  }, [coordinates]);

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=uv_index_max,sunrise,sunset&timezone=auto`
      );
      const weatherData = await weatherResponse.json();

      setWeather({
        temperature: Math.round(weatherData.current.temperature_2m),
        weatherCode: weatherData.current.weather_code,
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: Math.round(weatherData.current.wind_speed_10m),
        uvIndex: weatherData.daily.uv_index_max[0] || 0,
      });

      const sunrise = new Date(weatherData.daily.sunrise[0]);
      const sunset = new Date(weatherData.daily.sunset[0]);
      setSunTimes({
        sunrise: sunrise.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        sunset: sunset.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        sunriseDate: sunrise,
        sunsetDate: sunset,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLocationChange = (lat: number, lon: number, _name: string) => {
    setCoordinates({ lat, lon });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !is24Hour
    });
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
    <div className="space-y-2">
      {/* Location Selector */}
      <LocationSelector onLocationChange={handleLocationChange} isMidnight={isMidnight} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Time */}
        <div className="glass-effect rounded-xl p-3 shadow-glow">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#d4af37]" />
              <span className="text-xs font-medium text-[#d4af37]">Time</span>
            </div>
            <button
              onClick={toggleTimeFormat}
              className="text-[#d4af37]/60 hover:text-[#d4af37] transition-colors"
              title={is24Hour ? 'Switch to 12-hour format' : 'Switch to 24-hour format'}
            >
              {is24Hour ? <Clock3 className="w-3 h-3" /> : <Clock12 className="w-3 h-3" />}
            </button>
          </div>
          <div className="text-xl font-bold tabular-nums text-[#ddc3a5]">
            {formatTime(time)}
          </div>
          <div className="text-xs text-[#d4af37]/60 mt-0.5">
            {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* UV Index - Prominent Display */}
        <div className="glass-effect rounded-xl p-3 shadow-glow">
          <div className="flex items-center gap-1 mb-1">
            <Sun className="w-3 h-3 text-[#d4af37]" />
            <span className="text-xs font-medium text-[#d4af37]">UV Radiation</span>
          </div>
          {weather ? (
            <>
              <div className="text-2xl font-bold text-[#ddc3a5] mb-0.5">
                {weather.uvIndex}
              </div>
              <div className="text-xs text-[#d4af37] mb-1">
                {uvInfo?.level}
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-[#cd7f32]">UVA+UVB</span>
              </div>
            </>
          ) : (
            <div className="text-xs text-[#d4af37]/60">Select location</div>
          )}
        </div>

        {/* Weather */}
        <div className="glass-effect rounded-xl p-3 shadow-glow">
          <div className="flex items-center gap-1 mb-1">
            <Cloud className="w-3 h-3 text-[#d4af37]" />
            <span className="text-xs font-medium text-[#d4af37]">Weather</span>
          </div>
          {weather ? (
            <>
              <div className="text-xl font-bold text-[#ddc3a5]">
                {weather.temperature}°C
              </div>
              <div className="flex gap-2 mt-1 text-xs">
                <div className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-[#cd7f32]" />
                  <span className="text-[#ddc3a5]">{weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-[#cd7f32]" />
                  <span className="text-[#ddc3a5]">{weather.windSpeed}km/h</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-xs text-[#d4af37]/60">Select location</div>
          )}
        </div>

        {/* Sun Times */}
        <div className="glass-effect rounded-xl p-3 shadow-glow md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-1 mb-1">
            <Sun className="w-3 h-3 text-[#d4af37]" />
            <span className="text-xs font-medium text-[#d4af37]">Sunrise & Sunset</span>
          </div>
          {sunTimes ? (
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1">
                    <Sunrise className="w-3 h-3 text-[#cd7f32]" />
                    <span className="text-xs text-[#d4af37]/80">Sunrise</span>
                  </div>
                  {getHoursUntil(sunTimes.sunriseDate) && (
                    <span className="text-xs text-[#d4af37]/60">in {getHoursUntil(sunTimes.sunriseDate)}</span>
                  )}
                </div>
                <div className="text-base font-bold tabular-nums text-[#ddc3a5]">
                  {sunTimes.sunrise}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1">
                    <Sunset className="w-3 h-3 text-[#cd7f32]" />
                    <span className="text-xs text-[#d4af37]/80">Sunset</span>
                  </div>
                  {getHoursUntil(sunTimes.sunsetDate) && (
                    <span className="text-xs text-[#d4af37]/60">in {getHoursUntil(sunTimes.sunsetDate)}</span>
                  )}
                </div>
                <div className="text-base font-bold tabular-nums text-[#ddc3a5]">
                  {sunTimes.sunset}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-[#d4af37]/60">Select location</div>
          )}
        </div>
      </div>
    </div>
  );
}
