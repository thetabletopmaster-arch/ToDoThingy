import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListTodo } from 'lucide-react';
import TaskList from './components/TaskList';
import InfoBar from './components/InfoBar';
import CompactTimer from './components/CompactTimer';
import QuickLinks from './components/QuickLinks';
import ThemeToggle from './components/ThemeToggle';

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

      <div className="min-h-screen max-h-screen overflow-hidden p-4 md:p-6">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <ListTodo className={`w-8 h-8 ${isMidnight ? 'text-red-400' : 'text-blue-400'}`} />
              <h1 className={`text-3xl md:text-4xl font-bold ${isMidnight ? 'text-red-100' : 'text-blue-100'}`}>
                Productivity Dashboard
              </h1>
            </div>
            <p className={`text-sm ${isMidnight ? 'text-red-300/70' : 'text-slate-400'}`}>
              Stay focused, organized, and on track
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
            {/* Tasks - Takes up more space */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 min-h-0"
            >
              <TaskList isMidnight={isMidnight} />
            </motion.div>

            {/* Timer */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start"
            >
              <CompactTimer isMidnight={isMidnight} />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
