import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListTodo, Edit3 } from 'lucide-react';
import TaskList from './components/TaskList';
import InfoBar from './components/InfoBar';
import CompactTimer from './components/CompactTimer';
import QuickLinks from './components/QuickLinks';
import ThemeToggle from './components/ThemeToggle';
import Notes from './components/Notes';
import BackgroundSelector from './components/BackgroundSelector';
import MusicPlayer from './components/MusicPlayer';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const BACKGROUND_KEY = 'productivity-dashboard-background';
const LAYOUT_KEY = 'productivity-dashboard-layout';

const defaultLayout: Layout[] = [
  { i: 'quick-links', x: 0, y: 0, w: 12, h: 2, minW: 6, minH: 2 },
  { i: 'info-bar', x: 0, y: 2, w: 12, h: 3, minW: 6, minH: 3 },
  { i: 'task-list', x: 0, y: 5, w: 8, h: 8, minW: 4, minH: 6 },
  { i: 'timer', x: 8, y: 5, w: 4, h: 3, minW: 3, minH: 3 },
  { i: 'music', x: 8, y: 8, w: 4, h: 3, minW: 3, minH: 3 },
  { i: 'notes', x: 8, y: 11, w: 4, h: 4, minW: 3, minH: 3 },
];

function App() {
  const [isMidnight, setIsMidnight] = useState(() => {
    const saved = localStorage.getItem('midnight-mode');
    return saved === 'true';
  });

  const [backgroundImage, setBackgroundImage] = useState<string | null>(() => {
    return localStorage.getItem(BACKGROUND_KEY) || null;
  });

  const [isEditingLayout, setIsEditingLayout] = useState(false);

  const [layout, setLayout] = useState<Layout[]>(() => {
    const saved = localStorage.getItem(LAYOUT_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultLayout;
      }
    }
    return defaultLayout;
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

  const handleLayoutChange = (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    if (allLayouts.lg) {
      setLayout(allLayouts.lg);
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(allLayouts.lg));
    }
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
            <div className="flex items-center justify-center gap-2 mb-1 relative">
              <ListTodo className="w-6 h-6 text-[#d4af37]" />
              <h1 className="text-2xl md:text-3xl font-bold text-[#d4af37]" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
                Productivity Dashboard
              </h1>
              <button
                onClick={() => setIsEditingLayout(!isEditingLayout)}
                className={`absolute right-0 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                  isEditingLayout
                    ? 'bg-[#d4af37] text-[#1a120d]'
                    : 'bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/30'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                {isEditingLayout ? 'Done' : 'Edit Layout'}
              </button>
            </div>
            <p className="text-xs text-[#cd7f32]/80" style={{ fontFamily: 'Lora, Georgia, serif' }}>
              Build Your Legacy, One Task at a Time
            </p>
          </motion.header>

          {/* Grid Layout */}
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1024, md: 768, sm: 640, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
            onLayoutChange={handleLayoutChange}
            isDraggable={isEditingLayout}
            isResizable={isEditingLayout}
            compactType="vertical"
            preventCollision={false}
          >
            <div key="quick-links" className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="h-full w-full"
              >
                <QuickLinks isMidnight={isMidnight} />
              </motion.div>
            </div>

            <div key="info-bar" className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="h-full w-full"
              >
                <InfoBar isMidnight={isMidnight} />
              </motion.div>
            </div>

            <div key="task-list" className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="h-full w-full"
              >
                <TaskList isMidnight={isMidnight} />
              </motion.div>
            </div>

            <div key="timer" className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="h-full w-full"
              >
                <CompactTimer isMidnight={isMidnight} />
              </motion.div>
            </div>

            <div key="music" className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="h-full w-full"
              >
                <MusicPlayer isMidnight={isMidnight} />
              </motion.div>
            </div>

            <div key="notes" className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="h-full w-full"
              >
                <Notes isMidnight={isMidnight} />
              </motion.div>
            </div>
          </ResponsiveGridLayout>
        </div>
      </div>
    </>
  );
}

export default App;
