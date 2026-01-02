import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
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
      setTodayTasks([...todayTasks, { id: Date.now().toString(), text: newTodayTask }]);
      setNewTodayTask('');
    }
  };

  const handleAddLongtermTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLongtermTask.trim()) {
      setLongtermTasks([...longtermTasks, { id: Date.now().toString(), text: newLongtermTask }]);
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

  const handleCompleteTodayTask = (id: string) => {
    setTodayTasks(todayTasks.filter(task => task.id !== id));
  };

  const handleDeleteTodayTask = (id: string) => {
    setTodayTasks(todayTasks.filter(task => task.id !== id));
  };

  const handleCompleteLongtermTask = (id: string) => {
    setLongtermTasks(longtermTasks.filter(task => task.id !== id));
  };

  const handleDeleteLongtermTask = (id: string) => {
    setLongtermTasks(longtermTasks.filter(task => task.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Today's Tasks */}
      <div className="glass-effect rounded-2xl p-6 shadow-glow">
        <h2 className={`text-2xl font-bold mb-4 ${isMidnight ? 'text-red-300' : 'text-red-100'}`}>
          Today's Focus
        </h2>

        <form onSubmit={handleAddTodayTask} className="mb-5">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTodayTask}
              onChange={(e) => setNewTodayTask(e.target.value)}
              placeholder="Add a task for today..."
              className={`flex-1 px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all ${
                isMidnight
                  ? 'border-red-300/20 focus:ring-red-300 focus:border-red-300 bg-black text-red-50 placeholder-red-300/40'
                  : 'border-red-400/20 focus:ring-red-400 focus:border-red-400 bg-red-950/40 text-red-50 placeholder-red-200/40'
              }`}
            />
            <button
              type="submit"
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-glow hover:scale-105 active:scale-95 ${
                isMidnight
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
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
            <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-2">
              {todayTasks.map(task => (
                <SortableTaskItem
                  key={task.id}
                  id={task.id}
                  text={task.text}
                  onComplete={handleCompleteTodayTask}
                  onDelete={handleDeleteTodayTask}
                  isMidnight={isMidnight}
                />
              ))}
              {todayTasks.length === 0 && (
                <div className={`text-center py-8 ${isMidnight ? 'text-red-300/50' : 'text-red-200/50'}`}>
                  No tasks for today. Add one to get started!
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Long-term Goals */}
      <div className="glass-effect rounded-2xl p-6 shadow-glow">
        <h2 className={`text-2xl font-bold mb-4 ${isMidnight ? 'text-red-300' : 'text-red-100'}`}>
          Long-term Goals
        </h2>

        <form onSubmit={handleAddLongtermTask} className="mb-5">
          <div className="flex gap-3">
            <input
              type="text"
              value={newLongtermTask}
              onChange={(e) => setNewLongtermTask(e.target.value)}
              placeholder="Add a long-term goal..."
              className={`flex-1 px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all ${
                isMidnight
                  ? 'border-red-300/20 focus:ring-red-300 focus:border-red-300 bg-black text-red-50 placeholder-red-300/40'
                  : 'border-red-400/20 focus:ring-red-400 focus:border-red-400 bg-red-950/40 text-red-50 placeholder-red-200/40'
              }`}
            />
            <button
              type="submit"
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-glow hover:scale-105 active:scale-95 ${
                isMidnight
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
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
            <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-2">
              {longtermTasks.map(task => (
                <SortableTaskItem
                  key={task.id}
                  id={task.id}
                  text={task.text}
                  onComplete={handleCompleteLongtermTask}
                  onDelete={handleDeleteLongtermTask}
                  isMidnight={isMidnight}
                />
              ))}
              {longtermTasks.length === 0 && (
                <div className={`text-center py-8 ${isMidnight ? 'text-red-300/50' : 'text-red-200/50'}`}>
                  No long-term goals yet. Add one to start planning!
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
