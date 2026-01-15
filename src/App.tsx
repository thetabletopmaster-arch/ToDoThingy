import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListTodo } from 'lucide-react';
import TaskList from './components/TaskList';
import InfoBar from './components/InfoBar';
import CompactTimer from './components/CompactTimer';
import QuickLinks from './components/QuickLinks';
import ThemeToggle from './components/ThemeToggle';
import Notes from './components/Notes';
import PhilosophyQuote from './components/PhilosophyQuote';
import BackgroundSelector from './components/BackgroundSelector';
import MusicPlayer from './components/MusicPlayer';

const BACKGROUND_KEY = 'productivity-dashboard-background';

function App() {
  const [isMidnight, setIsMidnight] = useState(() => {
    const saved = localStorage.getItem('midnight-mode');
    return saved === 'true';
  });

  const [backgroundImage, setBackgroundImage] = useState<string | null>(() => {
    return localStorage.getItem(BACKGROUND_KEY) || null;
  });

  useEffect(() => {
    document.body.classList.toggle('midnight', isMidnight);
    localStorage.setItem('midnight-mode', String(isMidnight));
  }, [isMidnight]);

  useEffect(() => {
    if (backgroundImage) {
      document.body.style.backgroundImage = `url('${backgroundImage}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      document.body.style.backgroundImage = '';
    }
  }, [backgroundImage]);

  const handleBackgroundChange = (newBackground: string | null) => {
    setBackgroundImage(newBackground);
  };

  return (
    <>
      <ThemeToggle isMidnight={isMidnight} onToggle={() => setIsMidnight(!isMidnight)} />
      <BackgroundSelector onBackgroundChange={handleBackgroundChange} />

      <div className="min-h-screen p-2 md:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-3"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <ListTodo className="w-6 h-6 text-[#d4af37]" />
              <h1 className="text-2xl md:text-3xl font-bold text-[#d4af37]" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
                Productivity Dashboard
              </h1>
            </div>
            <p className="text-xs text-[#cd7f32]/80" style={{ fontFamily: 'Lora, Georgia, serif' }}>
              Build Your Legacy, One Task at a Time
            </p>
          </motion.header>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-2"
          >
            <QuickLinks isMidnight={isMidnight} />
          </motion.div>

          {/* Philosophy Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-2"
          >
            <PhilosophyQuote isMidnight={isMidnight} />
          </motion.div>

          {/* Info Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-3"
          >
            <InfoBar isMidnight={isMidnight} />
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Tasks - Takes up more space */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 space-y-3"
            >
              <TaskList isMidnight={isMidnight} />
            </motion.div>

            {/* Timer, Notes and Music Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <CompactTimer isMidnight={isMidnight} />
              <MusicPlayer isMidnight={isMidnight} />
              <Notes isMidnight={isMidnight} />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
