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
    <div className="glass-effect rounded-xl p-6 shadow-glow">
      <div className="flex items-center gap-2 mb-4">
        <TimerIcon className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-red-500">Timer</h3>
      </div>

      <div className="relative mb-6">
        <svg className="w-48 h-48 mx-auto transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="rgba(255, 51, 51, 0.2)"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            stroke="url(#gradient-red)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: '553', strokeDashoffset: '553' }}
            animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
            transition={{ duration: 0.5 }}
          />
          <defs>
            <linearGradient id="gradient-red" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff3333" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-5xl font-bold tabular-nums text-red-400">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSetTime()}
          disabled={isRunning}
          min="1"
          max="120"
          className="flex-1 px-3 py-2 rounded-lg border-2 border-red-500/40 focus:outline-none focus:border-red-500 bg-black/60 text-red-400 placeholder-red-500/30 transition-all disabled:opacity-50"
          placeholder="Minutes"
        />
        <button
          onClick={handleSetTime}
          disabled={isRunning}
          className="px-4 py-2 rounded-lg border-2 border-red-500 bg-transparent text-red-500 font-medium hover:bg-red-500/10 hover:border-red-400 transition-all disabled:opacity-50"
        >
          Set
        </button>
      </div>

      <div className="flex gap-3 justify-center">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="border-2 border-red-500 bg-transparent text-red-500 p-3 rounded-full transition-all hover:bg-red-500/10 hover:border-red-400"
          >
            <Play className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="border-2 border-red-500 bg-transparent text-red-500 p-3 rounded-full transition-all hover:bg-red-500/10 hover:border-red-400"
          >
            <Pause className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={handleReset}
          className="border-2 border-red-500 bg-transparent text-red-500 p-3 rounded-full transition-all hover:bg-red-500/10 hover:border-red-400"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
