import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema, type InsertTask } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface AddTaskFormProps {
  onClose: () => void;
  defaultCategory?: string;
}

const taskCategories = [
  { value: 'high_focus', label: 'High Focus/Important' },
  { value: 'quick_work', label: 'Quick Work' },
  { value: 'quick_personal', label: 'Quick Personal' },
  { value: 'home', label: 'Home' },
  { value: 'waiting_for', label: 'Waiting For' },
  { value: 'someday', label: 'Someday/Maybe' },
];

export default function AddTaskForm({ onClose, defaultCategory = 'quick_work' }: AddTaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      text: '',
      category: defaultCategory,
      completed: false,
    },
  });

  const handleSubmit = async (data: InsertTask) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      await queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Task created",
        description: `"${data.text}" has been added to your ${data.category.replace('_', ' ')} tasks.`,
      });
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add New Task</DialogTitle>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="task-text">Task Description</Label>
          <Input
            id="task-text"
            placeholder="Enter your task..."
            {...form.register('text')}
            data-testid="input-task-text"
          />
          {form.formState.errors.text && (
            <p className="text-sm text-destructive">{form.formState.errors.text.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="task-category">Category</Label>
          <Select
            value={form.watch('category')}
            onValueChange={(value) => form.setValue('category', value)}
          >
            <SelectTrigger data-testid="select-task-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {taskCategories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.category && (
            <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            data-testid="button-create-task"
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}