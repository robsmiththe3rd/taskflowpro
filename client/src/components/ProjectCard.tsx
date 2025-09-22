import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Project, Area } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Trash2 } from "lucide-react";
import EditProjectForm from "@/components/forms/EditProjectForm";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: areas = [] } = useQuery<Area[]>({
    queryKey: ['/api/areas'],
  });

  const updateAreaMutation = useMutation({
    mutationFn: async (areaId: string | undefined) => {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ areaId }),
      });
      if (!response.ok) {
        throw new Error('Failed to update project area');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project updated",
        description: `Area changed successfully.`,
      });
    },
    onError: (error) => {
      console.error('Error updating project area:', error);
      toast({
        title: "Error",
        description: "Failed to update project area. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const getAreaColor = (areaId: string | null) => {
    if (!areaId) return 'bg-muted text-muted-foreground';
    
    const areaIndex = areas.findIndex(area => area.id === areaId);
    const colors = [
      'bg-chart-1 text-white',
      'bg-chart-2 text-white', 
      'bg-chart-3 text-white',
      'bg-chart-4 text-white',
      'bg-chart-5 text-white',
    ];
    
    return colors[areaIndex % colors.length] || 'bg-chart-1 text-white';
  };

  const getAreaText = (areaId: string | null) => {
    if (!areaId) return 'No Area';
    const area = areas.find(area => area.id === areaId);
    return area?.title || 'Unknown Area';
  };

  const handleAreaChange = (newAreaId: string) => {
    const actualAreaId = newAreaId === 'none' ? undefined : newAreaId;
    updateAreaMutation.mutate(actualAreaId);
  };

  return (
    <>
      <Card 
        className="group hover-elevate transition-all duration-200"
        data-testid={`project-card-${project.id}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-semibold text-foreground leading-tight flex-1">
              {project.title}
            </h4>
            <div className="flex items-center gap-2">
              <Select
                value={project.areaId || 'none'}
                onValueChange={handleAreaChange}
                disabled={updateAreaMutation.isPending}
              >
                <SelectTrigger className="w-auto h-auto p-0 border-0 bg-transparent hover:bg-transparent">
                  <Badge 
                    className={`${getAreaColor(project.areaId)} cursor-pointer hover:opacity-80 transition-opacity ${
                      updateAreaMutation.isPending ? 'opacity-50' : ''
                    }`}
                    data-testid={`badge-area-${project.id}`}
                  >
                    {getAreaText(project.areaId)}
                  </Badge>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Area</SelectItem>
                  {areas.map(area => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditClick}
                  className="h-8 w-8 p-0"
                  data-testid={`button-edit-project-${project.id}`}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteClick}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  data-testid={`button-delete-project-${project.id}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        {project.notes && (
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              {project.notes}
            </p>
          </CardContent>
        )}
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <EditProjectForm 
            project={project}
            onClose={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DeleteConfirmDialog
            type="project"
            itemId={project.id}
            itemName={project.title}
            onClose={() => setIsDeleteDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}