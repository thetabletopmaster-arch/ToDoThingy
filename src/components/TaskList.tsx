import { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskItem from './TaskItem';

interface Task {
  id: string;
  text: string;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Review morning emails' },
    { id: '2', text: 'Complete project documentation' },
    { id: '3', text: 'Team meeting at 2 PM' },
  ]);
  const [newTaskText, setNewTaskText] = useState('');

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
    <div className="glass-effect rounded-2xl p-6 shadow-warm">
      <h2 className="text-2xl font-semibold text-warm-800 mb-4">Today's Tasks</h2>

      <form onSubmit={handleAddTask} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 rounded-lg border border-warm-200 focus:outline-none focus:ring-2 focus:ring-warm-400 bg-white/50"
          />
          <button
            type="submit"
            className="bg-warm-500 hover:bg-warm-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-warm"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            id={task.id}
            text={task.text}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-warm-400">
            No tasks yet. Add one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
