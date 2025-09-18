import { Project } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
}

export default function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const handleClick = () => {
    if (onEdit) {
      console.log('Edit project:', project.id);
      onEdit(project);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-chart-3 text-white';
      case 'on_hold':
        return 'bg-chart-5 text-white';
      case 'completed':
        return 'bg-chart-1 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'on_hold':
        return 'On Hold';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <Card 
      className={`hover-elevate cursor-pointer ${onEdit ? 'hover:border-primary/50' : ''}`}
      onClick={handleClick}
      data-testid={`project-card-${project.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-semibold text-foreground leading-tight flex-1">
            {project.title}
          </h4>
          <Badge className={getStatusColor(project.status)}>
            {getStatusText(project.status)}
          </Badge>
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
  );
}