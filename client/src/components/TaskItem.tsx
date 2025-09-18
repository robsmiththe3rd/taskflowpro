import { Task } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
}

export default function TaskItem({ task, onToggle }: TaskItemProps) {
  const handleToggle = (checked: boolean) => {
    console.log(`Task ${task.id} toggled to ${checked}`);
    onToggle(task.id, checked);
  };

  return (
    <div 
      className="flex items-start gap-3 p-3 border-b border-border/50 last:border-b-0 hover:bg-accent/20 transition-colors"
      data-testid={`task-item-${task.id}`}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleToggle}
        className="mt-0.5"
        data-testid={`checkbox-task-${task.id}`}
      />
      <span 
        className={`flex-1 leading-relaxed ${
          task.completed 
            ? 'text-muted-foreground line-through opacity-70' 
            : 'text-foreground'
        }`}
      >
        {task.text}
      </span>
    </div>
  );
}