import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import TaskItem from './TaskItem';

interface Task {
  id: string;
  text: string;
}

const TASKS_STORAGE_KEY = 'productivity-dashboard-tasks';

export default function TaskList({ isMidnight }: { isMidnight: boolean }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: newTaskText }]);
      setNewTaskText('');
    }
  };

  const handleCompleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="glass-effect rounded-2xl p-5 shadow-warm">
      <h2 className={`text-xl font-semibold mb-3 ${isMidnight ? 'text-red-100' : 'text-blue-100'}`}>
        Today's Tasks
      </h2>

      <form onSubmit={handleAddTask} className="mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm ${
              isMidnight
                ? 'border-red-500/30 focus:ring-red-500 bg-black/50 text-red-50 placeholder-red-300/50'
                : 'border-blue-500/30 focus:ring-blue-500 bg-slate-900/50 text-slate-100 placeholder-slate-400'
            }`}
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg ${
              isMidnight
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </form>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            id={task.id}
            text={task.text}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            isMidnight={isMidnight}
          />
        ))}
        {tasks.length === 0 && (
          <div className={`text-center py-6 text-sm ${isMidnight ? 'text-red-300/60' : 'text-slate-400'}`}>
            No tasks yet. Add one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
