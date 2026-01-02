import { useState, useEffect, useRef } from 'react';
import { Timer as TimerIcon, Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CompactTimer({ isMidnight }: { isMidnight: boolean }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('25');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds === 0) {
            setMinutes(prevMinutes => {
              if (prevMinutes === 0) {
                setIsRunning(false);
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('Timer Complete!', { body: 'Your timer has finished.' });
                }
                return 0;
              }
              return prevMinutes - 1;
            });
            return 59;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStart = () => {
    if (minutes === 0 && seconds === 0) return;
    setIsRunning(true);
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    const mins = parseInt(inputMinutes) || 25;
    setMinutes(mins);
    setSeconds(0);
  };

  const handleSetTime = () => {
    const mins = parseInt(inputMinutes) || 25;
    setMinutes(mins);
    setSeconds(0);
    setIsRunning(false);
  };

  const totalSeconds = minutes * 60 + seconds;
  const initialSeconds = (parseInt(inputMinutes) || 25) * 60;
  const progress = (totalSeconds / initialSeconds) * 100;

  return (
    <div className="glass-effect rounded-xl p-4 shadow-warm">
      <div className="flex items-center gap-2 mb-3">
        <TimerIcon className={`w-4 h-4 ${isMidnight ? 'text-red-400' : 'text-blue-400'}`} />
        <h3 className={`text-sm font-semibold ${isMidnight ? 'text-red-100' : 'text-blue-100'}`}>Timer</h3>
      </div>

      <div className="relative mb-3">
        <svg className="w-32 h-32 mx-auto transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            stroke={isMidnight ? 'rgba(220, 38, 38, 0.2)' : 'rgba(59, 130, 246, 0.2)'}
            strokeWidth="6"
            fill="none"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="58"
            stroke={`url(#gradient-${isMidnight ? 'red' : 'blue'})`}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: '364', strokeDashoffset: '364' }}
            animate={{ strokeDashoffset: 364 - (364 * progress) / 100 }}
            transition={{ duration: 0.5 }}
          />
          <defs>
            <linearGradient id="gradient-red" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`text-3xl font-bold tabular-nums ${isMidnight ? 'text-red-50' : 'text-slate-100'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          type="number"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSetTime()}
          disabled={isRunning}
          min="1"
          max="120"
          className={`flex-1 px-2 py-1 text-sm rounded-lg border focus:outline-none focus:ring-2 ${
            isMidnight
              ? 'border-red-500/30 focus:ring-red-500 bg-black/50 text-red-50 placeholder-red-300/50'
              : 'border-blue-500/30 focus:ring-blue-500 bg-slate-900/50 text-slate-100 placeholder-slate-400'
          } disabled:opacity-50`}
          placeholder="Min"
        />
        <button
          onClick={handleSetTime}
          disabled={isRunning}
          className={`px-3 py-1 text-sm rounded-lg transition-colors disabled:opacity-50 ${
            isMidnight
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Set
        </button>
      </div>

      <div className="flex gap-2 justify-center">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors shadow-lg"
          >
            <Play className="w-4 h-4" fill="white" />
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full transition-colors shadow-lg"
          >
            <Pause className="w-4 h-4" fill="white" />
          </button>
        )}
        <button
          onClick={handleReset}
          className={`p-2 rounded-full transition-colors shadow-lg ${
            isMidnight
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
