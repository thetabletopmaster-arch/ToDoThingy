import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';

interface DailyTask {
  id: string;
  text: string;
}

const DAILY_TASKS_KEY = 'productivity-dashboard-daily-tasks';

interface DailyTaskTemplatesProps {
  onAddToToday: (tasks: string[]) => void;
  isMidnight: boolean;
}

export default function DailyTaskTemplates({ onAddToToday, isMidnight: _isMidnight }: DailyTaskTemplatesProps) {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => {
    const stored = localStorage.getItem(DAILY_TASKS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [newDailyTask, setNewDailyTask] = useState('');

  useEffect(() => {
    localStorage.setItem(DAILY_TASKS_KEY, JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  const handleAddDailyTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDailyTask.trim()) {
      setDailyTasks([...dailyTasks, { id: Date.now().toString(), text: newDailyTask }]);
      setNewDailyTask('');
    }
  };

  const handleDeleteDailyTask = (id: string) => {
    setDailyTasks(dailyTasks.filter(task => task.id !== id));
  };

  const handleAddAllToToday = () => {
    if (dailyTasks.length > 0) {
      onAddToToday(dailyTasks.map(task => task.text));
    }
  };

  return (
    <div className="glass-effect rounded-xl p-4 shadow-glow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#d4af37]" />
          <h2 className="text-xl font-bold text-[#d4af37]">
            Daily Task Templates
          </h2>
        </div>
        {dailyTasks.length > 0 && (
          <button
            onClick={handleAddAllToToday}
            className="px-4 py-2 rounded-lg bg-[#d4af37] text-[#1a120d] font-medium hover:bg-[#cd7f32] transition-all shadow-md"
          >
            Add to Today
          </button>
        )}
      </div>

      <p className="text-sm text-[#ddc3a5]/70 mb-4">
        Save tasks you do every day here, then click "Add to Today" to quickly add them all to Today's Focus.
      </p>

      <form onSubmit={handleAddDailyTask} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newDailyTask}
            onChange={(e) => setNewDailyTask(e.target.value)}
            placeholder="Add a daily task template..."
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

      <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-2">
        {dailyTasks.map(task => (
          <div
            key={task.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-[#d4af37]/30 transition-all"
          >
            <Calendar className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
            <span className="flex-1 text-[#ddc3a5]">{task.text}</span>
            <button
              onClick={() => handleDeleteDailyTask(task.id)}
              className="text-[#cd7f32] hover:text-[#d4af37] transition-colors p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {dailyTasks.length === 0 && (
          <div className="text-center py-6 text-[#d4af37]/50 text-sm">
            No daily tasks yet. Add tasks you do every day!
          </div>
        )}
      </div>
    </div>
  );
}
