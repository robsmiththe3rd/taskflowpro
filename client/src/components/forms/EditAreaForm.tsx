import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAreaSchema, type Area, type InsertArea } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface EditAreaFormProps {
  area: Area;
  onClose: () => void;
}

export default function EditAreaForm({ area, onClose }: EditAreaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<InsertArea>({
    resolver: zodResolver(insertAreaSchema),
    defaultValues: {
      title: area.title,
      description: area.description || '',
    },
  });

  const handleSubmit = async (data: InsertArea) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/areas/${area.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update area');
      }

      await queryClient.invalidateQueries({ queryKey: ['/api/areas'] });
      toast({
        title: "Area updated",
        description: `"${data.title}" has been updated successfully.`,
      });
      onClose();
    } catch (error) {
      console.error('Error updating area:', error);
      toast({
        title: "Error",
        description: "Failed to update area. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Area of Focus</DialogTitle>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter area title..."
              {...form.register('title')}
              data-testid="input-edit-area-title"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any notes about this area..."
              rows={3}
              {...form.register('description')}
              data-testid="textarea-edit-area-description"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-testid="button-cancel-edit-area"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            data-testid="button-update-area"
          >
            {isSubmitting ? 'Updating...' : 'Update Area'}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}