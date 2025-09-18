import { Goal } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
}

export default function GoalCard({ goal, onEdit }: GoalCardProps) {
  const handleClick = () => {
    if (onEdit) {
      console.log('Edit goal:', goal.id);
      onEdit(goal);
    }
  };

  const getTimeframeIcon = (timeframe: string) => {
    switch (timeframe) {
      case 'vision':
        return '🏔️';
      case '3_5_year':
        return '🌟';
      case '1_2_year':
        return '🌟';
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
      default:
        return 'border-l-primary';
    }
  };

  return (
    <Card 
      className={`border-l-4 ${getTimeframeColor(goal.timeframe)} hover-elevate cursor-pointer ${
        onEdit ? 'hover:border-primary/50' : ''
      }`}
      onClick={handleClick}
      data-testid={`goal-card-${goal.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">
            {getTimeframeIcon(goal.timeframe)}
          </span>
          <p className="text-foreground leading-relaxed">
            {goal.text}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}