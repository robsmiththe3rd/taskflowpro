import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type Project, type InsertProject, type Area } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface EditProjectFormProps {
  project: Project;
  onClose: () => void;
}

const projectStatuses = [
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
];

export default function EditProjectForm({ project, onClose }: EditProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: areas = [] } = useQuery<Area[]>({
    queryKey: ['/api/areas'],
  });

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: project.title,
      status: project.status,
      notes: project.notes || '',
      areaId: project.areaId || undefined,
    },
  });

  const handleSubmit = async (data: InsertProject) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      await queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project updated",
        description: `Project has been updated successfully.`,
      });
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Project</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="project-title">Project Title</Label>
            <Input
              id="project-title"
              placeholder="Enter project title..."
              {...form.register('title')}
              data-testid="input-edit-project-title"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-status">Status</Label>
            <Select
              value={form.watch('status')}
              onValueChange={(value) => form.setValue('status', value)}
            >
              <SelectTrigger data-testid="select-edit-project-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {projectStatuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.status && (
              <p className="text-sm text-destructive">{form.formState.errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-area">Area of Focus (Optional)</Label>
            <Select
              value={form.watch('areaId') || ''}
              onValueChange={(value) => form.setValue('areaId', value || undefined)}
            >
              <SelectTrigger data-testid="select-edit-project-area">
                <SelectValue placeholder="Select area of focus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {areas.map(area => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.areaId && (
              <p className="text-sm text-destructive">{form.formState.errors.areaId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-notes">Notes (Optional)</Label>
            <Textarea
              id="project-notes"
              placeholder="Add any notes about this project..."
              {...form.register('notes')}
              data-testid="textarea-edit-project-notes"
            />
            {form.formState.errors.notes && (
              <p className="text-sm text-destructive">{form.formState.errors.notes.message}</p>
            )}
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} data-testid="button-cancel-edit">
          Cancel
        </Button>
        <Button 
          onClick={form.handleSubmit(handleSubmit)}
          disabled={isSubmitting}
          data-testid="button-save-project"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogFooter>
    </>
  );
}