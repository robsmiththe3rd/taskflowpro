import { useState } from "react";
import { Task } from "@shared/schema";
import TaskItem from "./TaskItem";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AddTaskForm from "@/components/forms/AddTaskForm";

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  onToggleTask: (id: string, completed: boolean) => void;
  category?: string; // For the add task form
}

export default function TaskSection({ title, tasks, onToggleTask, category }: TaskSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Map section titles to category values
  const getCategoryFromTitle = (title: string): string => {
    switch (title.toLowerCase()) {
      case 'high focus/important':
        return 'high_focus';
      case 'quick work':
        return 'quick_work';
      case 'quick personal':
        return 'quick_personal';
      case 'home':
        return 'home';
      case 'pending items':
        return 'waiting_for';
      case 'future considerations':
        return 'someday';
      default:
        return category || 'quick_work';
    }
  };
  if (tasks.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon(title)}
            <span>{title}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
            data-testid={`button-add-task-${getCategoryFromTitle(title)}`}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </h3>
        <div className="bg-card border border-card-border rounded-lg p-4 text-center text-muted-foreground">
          No tasks in this category yet
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <AddTaskForm 
              onClose={() => setIsAddDialogOpen(false)}
              defaultCategory={getCategoryFromTitle(title)}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getCategoryIcon(title)}
          <span>{title}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddDialogOpen(true)}
          data-testid={`button-add-task-${getCategoryFromTitle(title)}`}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </Button>
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
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <AddTaskForm 
            onClose={() => setIsAddDialogOpen(false)}
            defaultCategory={getCategoryFromTitle(title)}
          />
        </DialogContent>
      </Dialog>
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