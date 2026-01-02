import { useState, useEffect } from 'react';
import { Sunrise, Sunset, MapPin } from 'lucide-react';

interface SunTimes {
  sunrise: string;
  sunset: string;
}

export default function SunriseSunset() {
  const [sunTimes, setSunTimes] = useState<SunTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Fetch location name
            const geoResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const geoData = await geoResponse.json();
            setLocation(geoData.city || geoData.locality || 'Your Location');

            // Fetch sunrise/sunset times
            const response = await fetch(
              `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`
            );
            const data = await response.json();

            if (data.status === 'OK') {
              const sunrise = new Date(data.results.sunrise);
              const sunset = new Date(data.results.sunset);

              setSunTimes({
                sunrise: sunrise.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                }),
                sunset: sunset.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })
              });
            }
          } catch (error) {
            console.error('Error fetching sun times:', error);
          } finally {
            setLoading(false);
          }
        },
        () => {
          // Use default location if geolocation is denied
          setLocation('Default Location');
          setSunTimes({
            sunrise: '6:30 AM',
            sunset: '6:30 PM'
          });
          setLoading(false);
        }
      );
    } else {
      setLocation('Default Location');
      setSunTimes({
        sunrise: '6:30 AM',
        sunset: '6:30 PM'
      });
      setLoading(false);
    }
  }, []);

  return (
    <div className="glass-effect rounded-2xl p-6 shadow-warm">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-warm-600" />
        <span className="text-sm text-warm-600">{location}</span>
      </div>

      {loading ? (
        <div className="text-center py-4 text-warm-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Sunrise className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-sm text-warm-600 mb-1">Sunrise</div>
            <div className="text-2xl font-bold text-warm-700 tabular-nums">
              {sunTimes?.sunrise}
            </div>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Sunset className="w-8 h-8 text-amber-600" />
            </div>
            <div className="text-sm text-warm-600 mb-1">Sunset</div>
            <div className="text-2xl font-bold text-warm-700 tabular-nums">
              {sunTimes?.sunset}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
