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

function App() {
  const [isMidnight, setIsMidnight] = useState(() => {
    const saved = localStorage.getItem('midnight-mode');
    return saved === 'true';
  });

  useEffect(() => {
    document.body.classList.toggle('midnight', isMidnight);
    localStorage.setItem('midnight-mode', String(isMidnight));
  }, [isMidnight]);

  return (
    <>
      <ThemeToggle isMidnight={isMidnight} onToggle={() => setIsMidnight(!isMidnight)} />

      <div className="min-h-screen p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <ListTodo className="w-8 h-8 text-[#d4af37]" />
              <h1 className="text-3xl md:text-4xl font-bold text-[#d4af37]" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
                Productivity Dashboard
              </h1>
            </div>
            <p className="text-sm text-[#cd7f32]/80" style={{ fontFamily: 'Lora, Georgia, serif' }}>
              Build Your Legacy, One Task at a Time
            </p>
          </motion.header>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <QuickLinks isMidnight={isMidnight} />
          </motion.div>

          {/* Philosophy Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-4"
          >
            <PhilosophyQuote isMidnight={isMidnight} />
          </motion.div>

          {/* Info Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <InfoBar isMidnight={isMidnight} />
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Tasks - Takes up more space */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 space-y-4"
            >
              <TaskList isMidnight={isMidnight} />
            </motion.div>

            {/* Timer and Notes Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <CompactTimer isMidnight={isMidnight} />
              <Notes isMidnight={isMidnight} />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
