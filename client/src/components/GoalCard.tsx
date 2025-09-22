import { useState } from "react";
import { Goal } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Edit2, Trash2 } from "lucide-react";
import EditGoalForm from "@/components/forms/EditGoalForm";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Card, CardContent } from "@/components/ui/card";

interface GoalCardProps {
  goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const getTimeframeIcon = (timeframe: string) => {
    switch (timeframe) {
      case 'vision':
        return '🏔️';
      case '3_5_year':
        return '🌟';
      case '1_2_year':
        return '🌟';
      case 'quarterly':
        return '🔥';
      case 'weekly':
        return '✅';
      default:
        return '🎯';
    }
  };

  const getTimeframeColor = (timeframe: string) => {
    switch (timeframe) {
      case 'vision':
        return 'border-l-chart-4';
      case '3_5_year':
        return 'border-l-chart-2';
      case '1_2_year':
        return 'border-l-chart-3';
      case 'quarterly':
        return 'border-l-chart-1';
      case 'weekly':
        return 'border-l-chart-5';
      default:
        return 'border-l-primary';
    }
  };

  return (
    <>
      <Card 
        className={`group border-l-4 ${getTimeframeColor(goal.timeframe)} hover-elevate transition-all duration-200`}
        data-testid={`goal-card-${goal.id}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-xl flex-shrink-0">
                {getTimeframeIcon(goal.timeframe)}
              </span>
              <p className="text-foreground leading-relaxed">
                {goal.text}
              </p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditClick}
                className="h-8 w-8 p-0"
                data-testid={`button-edit-goal-${goal.id}`}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteClick}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                data-testid={`button-delete-goal-${goal.id}`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <EditGoalForm 
            goal={goal}
            onClose={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DeleteConfirmDialog
            type="goal"
            itemId={goal.id}
            itemName={goal.text}
            onClose={() => setIsDeleteDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}