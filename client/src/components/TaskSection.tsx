import { Task } from "@shared/schema";
import TaskItem from "./TaskItem";

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  onToggleTask: (id: string, completed: boolean) => void;
}

export default function TaskSection({ title, tasks, onToggleTask }: TaskSectionProps) {
  if (tasks.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          {getCategoryIcon(title)}
          <span>{title}</span>
        </h3>
        <div className="bg-card border border-card-border rounded-lg p-4 text-center text-muted-foreground">
          No tasks in this category yet
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
        {getCategoryIcon(title)}
        <span>{title}</span>
      </h3>
      <div className="bg-card border border-card-border rounded-lg overflow-hidden">
        {tasks.map(task => (
          <TaskItem 
            key={task.id}
            task={task}
            onToggle={onToggleTask}
          />
        ))}
      </div>
    </div>
  );
}

function getCategoryIcon(category: string): string {
  switch (category.toLowerCase().replace(/\s+/g, '_')) {
    case 'high_focus':
    case 'high_focus/important':
      return '🎯';
    case 'quick_work':
      return '⚡';
    case 'quick_personal':
      return '🏃';
    case 'home':
      return '🏠';
    case 'waiting_for':
      return '⏳';
    case 'someday':
      return '🌙';
    default:
      return '📋';
  }
}