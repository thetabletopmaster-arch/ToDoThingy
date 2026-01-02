import { motion } from 'framer-motion';
import { ListTodo } from 'lucide-react';
import TaskList from './components/TaskList';
import CurrentTime from './components/CurrentTime';
import SunriseSunset from './components/SunriseSunset';
import Timer from './components/Timer';

function App() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <ListTodo className="w-10 h-10 text-warm-600" />
            <h1 className="text-5xl font-bold text-warm-800">
              Productivity Dashboard
            </h1>
          </div>
          <p className="text-warm-600 text-lg">
            Stay focused, organized, and on track
          </p>
        </motion.header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <TaskList />
          </motion.div>

          {/* Right Column - Widgets */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CurrentTime />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SunriseSunset />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Timer />
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-warm-500 text-sm"
        >
          Built with focus and intention
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
