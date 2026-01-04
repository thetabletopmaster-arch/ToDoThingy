import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskItem from './TaskItem';

interface SortableTaskItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isMidnight: boolean;
}

export default function SortableTaskItem({ id, text, completed, onToggle, onDelete, isMidnight }: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskItem
        id={id}
        text={text}
        completed={completed}
        onToggle={onToggle}
        onDelete={onDelete}
        isMidnight={isMidnight}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
