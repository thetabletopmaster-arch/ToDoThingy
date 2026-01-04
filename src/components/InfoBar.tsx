import { useState, useEffect } from 'react';
import { Clock, Cloud, Sunrise, Sunset, Sun, Droplets, Wind } from 'lucide-react';
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
}

export default function InfoBar({ isMidnight }: { isMidnight: boolean }) {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [sunTimes, setSunTimes] = useState<SunTimes | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLocationChange = (lat: number, lon: number, name: string) => {
    setCoordinates({ lat, lon });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low', color: isMidnight ? 'text-green-400' : 'text-green-400' };
    if (uv <= 5) return { level: 'Mod', color: isMidnight ? 'text-yellow-300' : 'text-yellow-400' };
    if (uv <= 7) return { level: 'High', color: isMidnight ? 'text-orange-300' : 'text-orange-400' };
    return { level: 'Extreme', color: isMidnight ? 'text-red-300' : 'text-red-400' };
  };

  const uvInfo = weather ? getUVLevel(weather.uvIndex) : null;

  return (
    <div className="space-y-4">
      {/* Location Selector */}
      <LocationSelector onLocationChange={handleLocationChange} isMidnight={isMidnight} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Time */}
        <div className="glass-effect rounded-xl p-4 shadow-glow">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium text-amber-500">Time</span>
          </div>
          <div className="text-2xl font-bold tabular-nums text-amber-300">
            {formatTime(time)}
          </div>
          <div className="text-xs text-amber-500/60 mt-1">
            {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Weather */}
        <div className="glass-effect rounded-xl p-4 shadow-glow">
          <div className="flex items-center gap-2 mb-2">
            <Cloud className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium text-amber-500">Weather</span>
          </div>
          {weather ? (
            <>
              <div className="text-2xl font-bold text-amber-300">
                {weather.temperature}°C
              </div>
              <div className="flex gap-3 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-amber-500" />
                  <span className="text-amber-300">{weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-amber-500" />
                  <span className="text-amber-300">{weather.windSpeed}km/h</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span className="text-amber-300">{weather.uvIndex} {uvInfo?.level}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-amber-500/60">Select a location</div>
          )}
        </div>

        {/* Sun Times */}
        <div className="glass-effect rounded-xl p-4 shadow-glow">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium text-amber-500">Sun</span>
          </div>
          {sunTimes ? (
            <div className="flex gap-4">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Sunrise className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-amber-500/80">Rise</span>
                </div>
                <div className="text-lg font-bold tabular-nums text-amber-300">
                  {sunTimes.sunrise}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Sunset className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-amber-500/80">Set</span>
                </div>
                <div className="text-lg font-bold tabular-nums text-amber-300">
                  {sunTimes.sunset}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-amber-500/60">Select a location</div>
          )}
        </div>
      </div>
    </div>
  );
}
