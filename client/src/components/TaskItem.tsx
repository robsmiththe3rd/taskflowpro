import { useState } from "react";
import { Task } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Edit2, Trash2 } from "lucide-react";
import EditTaskForm from "@/components/forms/EditTaskForm";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
}

export default function TaskItem({ task, onToggle }: TaskItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleToggle = (checked: boolean | "indeterminate") => {
    const isChecked = Boolean(checked);
    console.log(`Task ${task.id} toggled to ${isChecked}`);
    onToggle(task.id, isChecked);
  };

  return (
    <>
      <div 
        className="group flex items-start gap-3 p-3 border-b border-border/50 last:border-b-0 hover:bg-accent/20 transition-colors"
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
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            className="h-8 w-8 p-0"
            data-testid={`button-edit-task-${task.id}`}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            data-testid={`button-delete-task-${task.id}`}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <EditTaskForm 
            task={task}
            onClose={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DeleteConfirmDialog
            type="task"
            itemId={task.id}
            itemName={task.text}
            onClose={() => setIsDeleteDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}