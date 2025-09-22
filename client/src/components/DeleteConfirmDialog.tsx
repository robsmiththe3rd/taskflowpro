import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface DeleteConfirmDialogProps {
  type: 'task' | 'project' | 'goal';
  itemId: string;
  itemName: string;
  onClose: () => void;
}

export default function DeleteConfirmDialog({ type, itemId, itemName, onClose }: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const endpoint = `/api/${type}s/${itemId}`;
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${type}`);
      }

      await queryClient.invalidateQueries({ queryKey: [`/api/${type}s`] });
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted`,
        description: `"${itemName}" has been permanently deleted.`,
      });
      onClose();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${type}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
        <DialogDescription>
          This will permanently remove the {type} from your GTD system.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={onClose}
          data-testid="button-cancel-delete"
        >
          Cancel
        </Button>
        <Button 
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          data-testid="button-confirm-delete"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogFooter>
    </>
  );
}