import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableTaskItem from './SortableTaskItem';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const TODAY_TASKS_KEY = 'productivity-dashboard-today-tasks';
const LONGTERM_TASKS_KEY = 'productivity-dashboard-longterm-tasks';

export default function TaskList({ isMidnight }: { isMidnight: boolean }) {
  const [todayTasks, setTodayTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(TODAY_TASKS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [longtermTasks, setLongtermTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(LONGTERM_TASKS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [newTodayTask, setNewTodayTask] = useState('');
  const [newLongtermTask, setNewLongtermTask] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    localStorage.setItem(TODAY_TASKS_KEY, JSON.stringify(todayTasks));
  }, [todayTasks]);

  useEffect(() => {
    localStorage.setItem(LONGTERM_TASKS_KEY, JSON.stringify(longtermTasks));
  }, [longtermTasks]);

  const handleAddTodayTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodayTask.trim()) {
      setTodayTasks([...todayTasks, { id: Date.now().toString(), text: newTodayTask, completed: false }]);
      setNewTodayTask('');
    }
  };

  const handleAddLongtermTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLongtermTask.trim()) {
      setLongtermTasks([...longtermTasks, { id: Date.now().toString(), text: newLongtermTask, completed: false }]);
      setNewLongtermTask('');
    }
  };

  const handleTodayDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTodayTasks((tasks) => {
        const oldIndex = tasks.findIndex((task) => task.id === active.id);
        const newIndex = tasks.findIndex((task) => task.id === over.id);
        return arrayMove(tasks, oldIndex, newIndex);
      });
    }
  };

  const handleLongtermDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLongtermTasks((tasks) => {
        const oldIndex = tasks.findIndex((task) => task.id === active.id);
        const newIndex = tasks.findIndex((task) => task.id === over.id);
        return arrayMove(tasks, oldIndex, newIndex);
      });
    }
  };

  const handleToggleTodayTask = (id: string) => {
    setTodayTasks(todayTasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTodayTask = (id: string) => {
    setTodayTasks(todayTasks.filter(task => task.id !== id));
  };

  const handleClearTodayCompleted = () => {
    setTodayTasks(todayTasks.filter(task => !task.completed));
  };

  const handleToggleLongtermTask = (id: string) => {
    setLongtermTasks(longtermTasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteLongtermTask = (id: string) => {
    setLongtermTasks(longtermTasks.filter(task => task.id !== id));
  };

  const handleClearLongtermCompleted = () => {
    setLongtermTasks(longtermTasks.filter(task => !task.completed));
  };

  const todayProgress = todayTasks.length > 0
    ? Math.round((todayTasks.filter(t => t.completed).length / todayTasks.length) * 100)
    : 0;

  const longtermProgress = longtermTasks.length > 0
    ? Math.round((longtermTasks.filter(t => t.completed).length / longtermTasks.length) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Today's Tasks */}
      <div className="glass-effect rounded-xl p-4 shadow-glow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-[#d4af37]">
            Today's Focus
          </h2>
          <div className="text-sm font-medium text-[#ddc3a5]">
            {todayProgress}% complete
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 h-2 bg-black/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#d4af37] to-[#cd7f32] transition-all duration-500 rounded-full"
            style={{ width: `${todayProgress}%` }}
          />
        </div>

        <form onSubmit={handleAddTodayTask} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodayTask}
              onChange={(e) => setNewTodayTask(e.target.value)}
              placeholder="Add a task for today..."
              className="flex-1 px-4 py-2 rounded-lg border-2 border-[#d4af37]/40 focus:outline-none focus:border-[#d4af37] bg-black/40 text-[#ddc3a5] placeholder-amber-500/30 transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#d4af37] text-[#1a120d] font-medium flex items-center gap-2 hover:bg-[#cd7f32] transition-all shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </form>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleTodayDragEnd}
        >
          <SortableContext
            items={todayTasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
              {todayTasks.map(task => (
                <SortableTaskItem
                  key={task.id}
                  id={task.id}
                  text={task.text}
                  completed={task.completed}
                  onToggle={handleToggleTodayTask}
                  onDelete={handleDeleteTodayTask}
                  isMidnight={isMidnight}
                />
              ))}
              {todayTasks.length === 0 && (
                <div className="text-center py-6 text-[#d4af37]/50 text-sm">
                  No tasks for today. Add one to get started!
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>

        {/* Clear Completed Button */}
        {todayTasks.some(t => t.completed) && (
          <button
            onClick={handleClearTodayCompleted}
            className="mt-4 w-full px-4 py-2 rounded-lg bg-[#cd7f32] text-[#1a120d] font-medium flex items-center justify-center gap-2 hover:bg-[#b8941e] transition-all shadow-md"
          >
            <Trash2 className="w-4 h-4" />
            Clear Completed
          </button>
        )}
      </div>

      {/* Long-term Goals */}
      <div className="glass-effect rounded-xl p-4 shadow-glow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-[#d4af37]">
            Long-term Goals
          </h2>
          <div className="text-sm font-medium text-[#ddc3a5]">
            {longtermProgress}% complete
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 h-2 bg-black/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#d4af37] to-[#cd7f32] transition-all duration-500 rounded-full"
            style={{ width: `${longtermProgress}%` }}
          />
        </div>

        <form onSubmit={handleAddLongtermTask} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newLongtermTask}
              onChange={(e) => setNewLongtermTask(e.target.value)}
              placeholder="Add a long-term goal..."
              className="flex-1 px-4 py-2 rounded-lg border-2 border-[#d4af37]/40 focus:outline-none focus:border-[#d4af37] bg-black/40 text-[#ddc3a5] placeholder-amber-500/30 transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#d4af37] text-[#1a120d] font-medium flex items-center gap-2 hover:bg-[#cd7f32] transition-all shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </form>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleLongtermDragEnd}
        >
          <SortableContext
            items={longtermTasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
              {longtermTasks.map(task => (
                <SortableTaskItem
                  key={task.id}
                  id={task.id}
                  text={task.text}
                  completed={task.completed}
                  onToggle={handleToggleLongtermTask}
                  onDelete={handleDeleteLongtermTask}
                  isMidnight={isMidnight}
                />
              ))}
              {longtermTasks.length === 0 && (
                <div className="text-center py-6 text-[#d4af37]/50 text-sm">
                  No long-term goals yet. Add one to start planning!
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>

        {/* Clear Completed Button */}
        {longtermTasks.some(t => t.completed) && (
          <button
            onClick={handleClearLongtermCompleted}
            className="mt-4 w-full px-4 py-2 rounded-lg bg-[#cd7f32] text-[#1a120d] font-medium flex items-center justify-center gap-2 hover:bg-[#b8941e] transition-all shadow-md"
          >
            <Trash2 className="w-4 h-4" />
            Clear Completed
          </button>
        )}
      </div>
    </div>
  );
}
