import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ListTodo, Edit3, GripVertical, Settings as SettingsIcon } from 'lucide-react';
import TaskList from './components/TaskList';
import InfoBar from './components/InfoBar';
import CompactTimer from './components/CompactTimer';
import QuickLinks from './components/QuickLinks';
import Notes from './components/Notes';
import MusicPlayer from './components/MusicPlayer';
import PhilosophyQuote from './components/PhilosophyQuote';
import Settings from './components/Settings';

const BACKGROUND_KEY = 'productivity-dashboard-background';
const POSITIONS_KEY = 'productivity-dashboard-positions';

interface ComponentPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Positions {
  [key: string]: ComponentPosition;
}

const defaultPositions: Positions = {
  'quick-links': { x: 20, y: 100, width: 800, height: 80 },
  'info-bar': { x: 20, y: 200, width: 500, height: 200 },
  'daily-quote': { x: 540, y: 200, width: 280, height: 200 },
  'task-list': { x: 20, y: 420, width: 500, height: 400 },
  'timer': { x: 540, y: 420, width: 280, height: 180 },
  'music': { x: 540, y: 620, width: 280, height: 180 },
  'notes': { x: 540, y: 820, width: 280, height: 200 },
};

function App() {
  const [isMidnight, setIsMidnight] = useState(() => {
    const saved = localStorage.getItem('midnight-mode');
    return saved === 'true';
  });

  const [backgroundImage, setBackgroundImage] = useState<string | null>(() => {
    return localStorage.getItem(BACKGROUND_KEY) || null;
  });

  const [isEditingLayout, setIsEditingLayout] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [positions, setPositions] = useState<Positions>(() => {
    const saved = localStorage.getItem(POSITIONS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultPositions;
      }
    }
    return defaultPositions;
  });

  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState<string | null>(null);

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
    if (newBackground) {
      localStorage.setItem(BACKGROUND_KEY, newBackground);
    } else {
      localStorage.removeItem(BACKGROUND_KEY);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (!isEditingLayout) return;

    const pos = positions[id];
    setDragging(id);
    setDragOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;

    const newPositions = {
      ...positions,
      [dragging]: {
        ...positions[dragging],
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      }
    };

    setPositions(newPositions);
  };

  const handleMouseUp = () => {
    if (dragging) {
      localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
      setDragging(null);
    }
    if (resizing) {
      localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
      setResizing(null);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent, id: string) => {
    if (!isEditingLayout) return;
    e.stopPropagation();
    setResizing(id);
  };

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (!resizing) return;

    const pos = positions[resizing];
    const newWidth = Math.max(200, e.clientX - pos.x);
    const newHeight = Math.max(100, e.clientY - pos.y);

    const newPositions = {
      ...positions,
      [resizing]: {
        ...positions[resizing],
        width: newWidth,
        height: newHeight
      }
    };

    setPositions(newPositions);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, dragOffset]);

  useEffect(() => {
    if (resizing) {
      window.addEventListener('mousemove', handleResizeMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleResizeMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizing, positions]);

  const renderDraggableComponent = (
    id: string,
    Component: React.ReactNode,
    delay: number
  ) => {
    const pos = positions[id];
    return (
      <motion.div
        key={id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay }}
        style={{
          position: 'absolute',
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: `${pos.width}px`,
          height: `${pos.height}px`,
          cursor: isEditingLayout ? 'move' : 'default',
          zIndex: dragging === id ? 1000 : 1,
        }}
        className="transition-shadow"
      >
        {isEditingLayout && (
          <div
            onMouseDown={(e) => handleMouseDown(e, id)}
            className="absolute top-0 left-0 right-0 h-8 bg-[#d4af37]/20 rounded-t-xl flex items-center justify-center cursor-move border-b-2 border-[#d4af37]/40 hover:bg-[#d4af37]/30 transition-colors"
          >
            <GripVertical className="w-4 h-4 text-[#d4af37]" />
          </div>
        )}
        <div className={`h-full overflow-auto ${isEditingLayout ? 'pt-8' : ''}`}>
          {Component}
        </div>
        {isEditingLayout && (
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, id)}
            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize"
            style={{
              background: 'linear-gradient(135deg, transparent 50%, rgba(212, 175, 55, 0.5) 50%)',
            }}
          />
        )}
      </motion.div>
    );
  };

  return (
    <>
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isMidnight={isMidnight}
        onToggleMidnight={() => setIsMidnight(!isMidnight)}
        onBackgroundChange={handleBackgroundChange}
      />

      <div className="min-h-screen p-2 md:p-4">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-3"
        >
          <div className="flex items-center justify-center gap-2 mb-1 relative max-w-7xl mx-auto">
            <ListTodo className="w-6 h-6 text-[#d4af37]" />
            <h1 className="text-2xl md:text-3xl font-bold text-[#d4af37]" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
              Productivity Dashboard
            </h1>
            <div className="absolute right-0 flex items-center gap-2">
              <button
                onClick={() => setIsEditingLayout(!isEditingLayout)}
                className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                  isEditingLayout
                    ? 'bg-[#d4af37] text-[#1a120d]'
                    : 'bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/30'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                {isEditingLayout ? 'Done' : 'Edit Layout'}
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 transition-all bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/30"
              >
                <SettingsIcon className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
          <p className="text-xs text-[#cd7f32]/80" style={{ fontFamily: 'Lora, Georgia, serif' }}>
            Build Your Legacy, One Task at a Time
          </p>
        </motion.header>

        {/* Free-form draggable components */}
        <div className="relative" style={{ minHeight: '1200px' }}>
          {renderDraggableComponent('quick-links', <QuickLinks isMidnight={isMidnight} />, 0.1)}
          {renderDraggableComponent('info-bar', <InfoBar isMidnight={isMidnight} />, 0.2)}
          {renderDraggableComponent('daily-quote', <PhilosophyQuote isMidnight={isMidnight} />, 0.25)}
          {renderDraggableComponent('task-list', <TaskList isMidnight={isMidnight} />, 0.3)}
          {renderDraggableComponent('timer', <CompactTimer isMidnight={isMidnight} />, 0.4)}
          {renderDraggableComponent('music', <MusicPlayer isMidnight={isMidnight} />, 0.5)}
          {renderDraggableComponent('notes', <Notes isMidnight={isMidnight} />, 0.6)}
        </div>
      </div>
    </>
  );
}

export default App;
