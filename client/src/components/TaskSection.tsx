import { useState } from "react";
import { Task } from "@shared/schema";
import TaskItem from "./TaskItem";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, ChevronRight } from "lucide-react";
import AddTaskForm from "@/components/forms/AddTaskForm";

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  onToggleTask: (id: string, completed: boolean) => void;
  category?: string; // For the add task form
  defaultOpen?: boolean; // Whether section starts open/closed
}

export default function TaskSection({ title, tasks, onToggleTask, category, defaultOpen = true }: TaskSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultOpen);

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
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-md transition-colors flex-1 min-w-0"
            data-testid={`button-toggle-${getCategoryFromTitle(title)}`}
          >
            <ChevronRight 
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
            <span className="text-lg font-semibold text-foreground flex items-center gap-2">
              {getCategoryIcon(title)}
              <span>{title}</span>
            </span>
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
            data-testid={`button-add-task-${getCategoryFromTitle(title)}`}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
        
        <div 
          className={`transition-all duration-300 ${
            isExpanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="bg-card border border-card-border rounded-lg p-4 text-center text-muted-foreground">
            No tasks in this category yet
          </div>
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
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-md transition-colors flex-1 min-w-0"
          data-testid={`button-toggle-${getCategoryFromTitle(title)}`}
        >
          <ChevronRight 
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
          <span className="text-lg font-semibold text-foreground flex items-center gap-2">
            {getCategoryIcon(title)}
            <span>{title}</span>
            <span className="text-sm text-muted-foreground font-normal">({tasks.length})</span>
          </span>
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddDialogOpen(true)}
          data-testid={`button-add-task-${getCategoryFromTitle(title)}`}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>
      
      <div 
        className={`transition-all duration-300 ${
          isExpanded ? 'max-h-96 opacity-100 overflow-y-auto mt-3' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
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