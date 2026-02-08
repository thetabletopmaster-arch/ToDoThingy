import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Edit3, GripVertical, Settings as SettingsIcon } from 'lucide-react';
import TaskList from './components/TaskList';
import InfoBar from './components/InfoBar';
import CompactTimer from './components/CompactTimer';
import QuickLinks from './components/QuickLinks';
import Notes from './components/Notes';
import MusicPlayer from './components/MusicPlayer';
import PhilosophyQuote from './components/PhilosophyQuote';
import CryptoPrice from './components/CryptoPrice';
import Settings from './components/Settings';

const BACKGROUND_KEY = 'productivity-dashboard-background';
const POSITIONS_KEY = 'productivity-dashboard-positions';
const LAYOUT_PRESET_KEY = 'productivity-dashboard-layout-preset';
const VISIBILITY_KEY = 'productivity-dashboard-visibility';
const STYLES_KEY = 'productivity-dashboard-styles';

interface ComponentPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Positions {
  [key: string]: ComponentPosition;
}

interface ComponentVisibility {
  [key: string]: boolean;
}

interface ComponentStyle {
  backgroundColor?: string;
  opacity?: number;
}

// Preset Layouts - Optimized for 1920x1080 displays
const layoutPresets = {
  // Compact: Classic 2-column layout
  compact: {
    'quick-links': { x: 20, y: 20, width: 1100, height: 100 },
    'info-bar': { x: 20, y: 140, width: 650, height: 250 },
    'daily-quote': { x: 690, y: 140, width: 430, height: 250 },
    'task-list': { x: 20, y: 410, width: 650, height: 450 },
    'timer': { x: 690, y: 410, width: 430, height: 180 },
    'crypto': { x: 690, y: 610, width: 430, height: 180 },
    'music': { x: 690, y: 810, width: 430, height: 110 },
    'notes': { x: 20, y: 880, width: 650, height: 100 },
  },

  // Wide: 3-column layout with task list on right
  wide: {
    'quick-links': { x: 20, y: 20, width: 1400, height: 100 },
    'info-bar': { x: 20, y: 140, width: 450, height: 280 },
    'daily-quote': { x: 490, y: 140, width: 450, height: 280 },
    'task-list': { x: 960, y: 140, width: 460, height: 720 },
    'timer': { x: 20, y: 440, width: 280, height: 200 },
    'crypto': { x: 20, y: 660, width: 280, height: 200 },
    'music': { x: 320, y: 440, width: 310, height: 200 },
    'notes': { x: 320, y: 660, width: 310, height: 200 },
  },

  // Balanced: Centered layout with symmetry
  balanced: {
    'quick-links': { x: 180, y: 20, width: 1200, height: 100 },
    'info-bar': { x: 50, y: 140, width: 550, height: 280 },
    'daily-quote': { x: 620, y: 140, width: 550, height: 280 },
    'task-list': { x: 320, y: 440, width: 680, height: 420 },
    'timer': { x: 50, y: 440, width: 250, height: 200 },
    'crypto': { x: 50, y: 660, width: 250, height: 200 },
    'music': { x: 1020, y: 440, width: 360, height: 200 },
    'notes': { x: 1020, y: 660, width: 360, height: 200 },
  },
};

const defaultPositions: Positions = layoutPresets.compact;

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
        const savedPositions = JSON.parse(saved);
        // Merge saved positions with defaults to handle new components
        return { ...defaultPositions, ...savedPositions };
      } catch {
        return defaultPositions;
      }
    }
    return defaultPositions;
  });

  const [componentVisibility, setComponentVisibility] = useState<ComponentVisibility>(() => {
    const saved = localStorage.getItem(VISIBILITY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          'quick-links': true,
          'info-bar': true,
          'daily-quote': true,
          'task-list': true,
          'timer': true,
          'crypto': true,
          'music': true,
          'notes': true,
        };
      }
    }
    return {
      'quick-links': true,
      'info-bar': true,
      'daily-quote': true,
      'task-list': true,
      'timer': true,
      'crypto': true,
      'music': true,
      'notes': true,
    };
  });

  const [componentStyles, setComponentStyles] = useState<{ [key: string]: ComponentStyle }>(() => {
    const saved = localStorage.getItem(STYLES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState<string | null>(null);

  // Snap-to-grid helper
  const snapToGrid = (value: number, screenSize: number) => {
    const SNAP_DISTANCE = 20; // pixels
    const snapPoints = [
      0, // Edge
      screenSize / 8,
      screenSize / 4,
      (screenSize * 3) / 8,
      screenSize / 2, // Center
      (screenSize * 5) / 8,
      (screenSize * 3) / 4,
      (screenSize * 7) / 8,
      screenSize - 20, // Other edge (with padding)
    ];

    for (const point of snapPoints) {
      if (Math.abs(value - point) < SNAP_DISTANCE) {
        return point;
      }
    }
    return value;
  };

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

  const applyLayoutPreset = (presetName: keyof typeof layoutPresets) => {
    setPositions(layoutPresets[presetName]);
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(layoutPresets[presetName]));
    localStorage.setItem(LAYOUT_PRESET_KEY, presetName);
  };

  const toggleComponentVisibility = (id: string) => {
    const newVisibility = {
      ...componentVisibility,
      [id]: !componentVisibility[id],
    };
    setComponentVisibility(newVisibility);
    localStorage.setItem(VISIBILITY_KEY, JSON.stringify(newVisibility));
  };

  const updateComponentStyle = (id: string, style: ComponentStyle) => {
    const newStyles = {
      ...componentStyles,
      [id]: { ...componentStyles[id], ...style },
    };
    setComponentStyles(newStyles);
    localStorage.setItem(STYLES_KEY, JSON.stringify(newStyles));
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

    const rawX = e.clientX - dragOffset.x;
    const rawY = e.clientY - dragOffset.y;

    // Apply snapping
    const snappedX = snapToGrid(rawX, window.innerWidth);
    const snappedY = snapToGrid(rawY, window.innerHeight);

    const newPositions = {
      ...positions,
      [dragging]: {
        ...positions[dragging],
        x: snappedX,
        y: snappedY
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
    const newWidth = Math.max(250, e.clientX - pos.x + 10);
    const newHeight = Math.max(150, e.clientY - pos.y + 10);

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
    if (!pos) {
      console.error(`No position found for component: ${id}`);
      return null;
    }

    // Check if component is visible
    if (!componentVisibility[id]) {
      return null;
    }

    const customStyle = componentStyles[id] || {};

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
          opacity: customStyle.opacity !== undefined ? customStyle.opacity : 1,
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
        <div
          className={`h-full w-full ${isEditingLayout ? 'pt-8' : ''}`}
          style={{
            overflow: 'hidden',
            backgroundColor: customStyle.backgroundColor,
          }}
        >
          <div className="h-full w-full overflow-auto">
            {Component}
          </div>
        </div>
        {isEditingLayout && (
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, id)}
            className="resize-handle absolute bottom-0 right-0 w-16 h-16 cursor-nwse-resize hover:bg-[#d4af37]/30 transition-all rounded-tl-2xl"
            style={{
              background: 'linear-gradient(135deg, transparent 50%, rgba(212, 175, 55, 0.5) 50%)',
            }}
          >
            <div className="absolute bottom-2 right-2 w-10 h-10 flex items-center justify-center">
              <div className="space-y-1">
                <div className="flex gap-1 justify-end">
                  <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
                </div>
                <div className="flex gap-1 justify-end">
                  <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
                </div>
                <div className="flex gap-1 justify-end">
                  <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
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
        onApplyLayoutPreset={applyLayoutPreset}
        componentVisibility={componentVisibility}
        onToggleVisibility={toggleComponentVisibility}
        componentStyles={componentStyles}
        onUpdateStyle={updateComponentStyle}
      />

      <div className="min-h-screen p-2 md:p-4">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 flex justify-end gap-2"
        >
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
        </motion.header>

        {/* Free-form draggable components */}
        <div className="relative" style={{ minHeight: '1200px' }}>
          {renderDraggableComponent('quick-links', <QuickLinks isMidnight={isMidnight} />, 0.1)}
          {renderDraggableComponent('info-bar', <InfoBar isMidnight={isMidnight} />, 0.2)}
          {renderDraggableComponent('daily-quote', <PhilosophyQuote isMidnight={isMidnight} />, 0.25)}
          {renderDraggableComponent('task-list', <TaskList isMidnight={isMidnight} />, 0.3)}
          {renderDraggableComponent('timer', <CompactTimer isMidnight={isMidnight} />, 0.4)}
          {renderDraggableComponent('crypto', <CryptoPrice isMidnight={isMidnight} />, 0.45)}
          {renderDraggableComponent('music', <MusicPlayer isMidnight={isMidnight} />, 0.5)}
          {renderDraggableComponent('notes', <Notes isMidnight={isMidnight} />, 0.6)}
        </div>
      </div>
    </>
  );
}

export default App;
