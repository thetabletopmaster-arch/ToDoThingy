import { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, Wind, Droplets } from 'lucide-react';

interface WeatherData {
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  icon: string;
}

const getWeatherIcon = (iconCode: string, size: number = 32) => {
  const code = iconCode.slice(0, 2);
  const props = { className: `w-${size/4} h-${size/4}`, size };

  switch (code) {
    case '01': return <Sun {...props} className={`w-12 h-12 text-yellow-400`} />;
    case '02': return <Cloud {...props} className={`w-12 h-12 text-slate-300`} />;
    case '03': return <Cloud {...props} className={`w-12 h-12 text-slate-400`} />;
    case '04': return <Cloud {...props} className={`w-12 h-12 text-slate-500`} />;
    case '09': return <CloudDrizzle {...props} className={`w-12 h-12 text-blue-400`} />;
    case '10': return <CloudRain {...props} className={`w-12 h-12 text-blue-500`} />;
    case '11': return <CloudRain {...props} className={`w-12 h-12 text-purple-500`} />;
    case '13': return <CloudSnow {...props} className={`w-12 h-12 text-blue-200`} />;
    case '50': return <Wind {...props} className={`w-12 h-12 text-slate-400`} />;
    default: return <Sun {...props} className={`w-12 h-12 text-yellow-400`} />;
  }
};

const getUVLevel = (uv: number) => {
  if (uv <= 2) return { level: 'Low', color: 'text-green-400' };
  if (uv <= 5) return { level: 'Moderate', color: 'text-yellow-400' };
  if (uv <= 7) return { level: 'High', color: 'text-orange-400' };
  if (uv <= 10) return { level: 'Very High', color: 'text-red-400' };
  return { level: 'Extreme', color: 'text-purple-400' };
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Using Open-Meteo API (free, no API key required)
            const weatherResponse = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=uv_index_max&timezone=auto`
            );
            const weatherData = await weatherResponse.json();

            // Get location name
            const geoResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const geoData = await geoResponse.json();
            setLocation(geoData.city || geoData.locality || 'Your Location');

            // Map weather codes to descriptions and icons
            const weatherCode = weatherData.current.weather_code;
            const weatherMapping: { [key: number]: { description: string; icon: string } } = {
              0: { description: 'Clear sky', icon: '01d' },
              1: { description: 'Mainly clear', icon: '02d' },
              2: { description: 'Partly cloudy', icon: '02d' },
              3: { description: 'Overcast', icon: '04d' },
              45: { description: 'Foggy', icon: '50d' },
              48: { description: 'Foggy', icon: '50d' },
              51: { description: 'Light drizzle', icon: '09d' },
              53: { description: 'Drizzle', icon: '09d' },
              55: { description: 'Heavy drizzle', icon: '09d' },
              61: { description: 'Light rain', icon: '10d' },
              63: { description: 'Rain', icon: '10d' },
              65: { description: 'Heavy rain', icon: '10d' },
              71: { description: 'Light snow', icon: '13d' },
              73: { description: 'Snow', icon: '13d' },
              75: { description: 'Heavy snow', icon: '13d' },
              95: { description: 'Thunderstorm', icon: '11d' },
            };

            const currentWeather = weatherMapping[weatherCode] || { description: 'Unknown', icon: '01d' };

            setWeather({
              temperature: Math.round(weatherData.current.temperature_2m),
              feelsLike: Math.round(weatherData.current.apparent_temperature),
              description: currentWeather.description,
              humidity: weatherData.current.relative_humidity_2m,
              windSpeed: Math.round(weatherData.current.wind_speed_10m),
              uvIndex: weatherData.daily.uv_index_max[0] || 0,
              icon: currentWeather.icon,
            });
          } catch (error) {
            console.error('Error fetching weather:', error);
          } finally {
            setLoading(false);
          }
        },
        () => {
          setLoading(false);
          setLocation('Location unavailable');
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  const uvInfo = weather ? getUVLevel(weather.uvIndex) : null;

  return (
    <div className="glass-effect rounded-2xl p-6 shadow-warm">
      <div className="flex items-center gap-2 mb-4">
        <Cloud className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-semibold text-slate-100">Weather</h2>
      </div>

      {loading ? (
        <div className="text-center py-4 text-slate-400">Loading...</div>
      ) : weather ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-slate-400 mb-1">{location}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-slate-100">
                  {weather.temperature}°
                </span>
                <span className="text-slate-400">C</span>
              </div>
              <div className="text-sm text-slate-400 mt-1">
                Feels like {weather.feelsLike}°C
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              {getWeatherIcon(weather.icon)}
              <span className="text-sm text-slate-300 capitalize">
                {weather.description}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-purple-500/30">
            <div className="text-center">
              <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <div className="text-xs text-slate-400">Humidity</div>
              <div className="text-sm font-semibold text-slate-200">{weather.humidity}%</div>
            </div>

            <div className="text-center">
              <Wind className="w-5 h-5 text-slate-400 mx-auto mb-1" />
              <div className="text-xs text-slate-400">Wind</div>
              <div className="text-sm font-semibold text-slate-200">{weather.windSpeed} km/h</div>
            </div>

            <div className="text-center">
              <Sun className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <div className="text-xs text-slate-400">UV Index</div>
              <div className={`text-sm font-semibold ${uvInfo?.color}`}>
                {weather.uvIndex} {uvInfo?.level}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-4 text-slate-400">
          Weather data unavailable
        </div>
      )}
    </div>
  );
}
