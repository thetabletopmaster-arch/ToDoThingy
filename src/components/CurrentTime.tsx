import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CurrentTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="glass-effect rounded-2xl p-6 shadow-warm">
      <div className="flex items-center gap-3 mb-3">
        <Clock className="w-6 h-6 text-warm-600" />
        <h2 className="text-xl font-semibold text-warm-800">Current Time</h2>
      </div>

      <div className="text-center">
        <div className="text-5xl font-bold text-warm-700 tabular-nums">
          {formatTime(time)}
        </div>
        <div className="text-sm text-warm-500 mt-2">
          {formatDate(time)}
        </div>
      </div>
    </div>
  );
}
