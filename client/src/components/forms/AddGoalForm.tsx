import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGoalSchema, type InsertGoal } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface AddGoalFormProps {
  onClose: () => void;
  defaultTimeframe?: string;
}

const goalTimeframes = [
  { value: 'vision', label: '10-20 Year Vision' },
  { value: '3_5_year', label: '3-5 Year Goals' },
  { value: '1_2_year', label: '1-2 Year Goals' },
];

export default function AddGoalForm({ onClose, defaultTimeframe = '1_2_year' }: AddGoalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<InsertGoal>({
    resolver: zodResolver(insertGoalSchema),
    defaultValues: {
      text: '',
      timeframe: defaultTimeframe,
    },
  });

  const handleSubmit = async (data: InsertGoal) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create goal');
      }

      await queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      const timeframeLabel = goalTimeframes.find(t => t.value === data.timeframe)?.label || data.timeframe;
      toast({
        title: "Goal created",
        description: `"${data.text}" has been added to your ${timeframeLabel}.`,
      });
      onClose();
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add New Goal</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="goal-text">Goal Description</Label>
            <Input
              id="goal-text"
              placeholder="Enter your goal..."
              {...form.register('text')}
              data-testid="input-goal-text"
            />
            {form.formState.errors.text && (
              <p className="text-sm text-destructive">{form.formState.errors.text.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-timeframe">Timeframe</Label>
            <Select
              value={form.watch('timeframe')}
              onValueChange={(value) => form.setValue('timeframe', value)}
            >
              <SelectTrigger data-testid="select-goal-timeframe">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                {goalTimeframes.map(timeframe => (
                  <SelectItem key={timeframe.value} value={timeframe.value}>
                    {timeframe.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.timeframe && (
              <p className="text-sm text-destructive">{form.formState.errors.timeframe.message}</p>
            )}
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} data-testid="button-cancel">
          Cancel
        </Button>
        <Button 
          onClick={form.handleSubmit(handleSubmit)}
          disabled={isSubmitting}
          data-testid="button-create-goal"
        >
          {isSubmitting ? 'Creating...' : 'Create Goal'}
        </Button>
      </DialogFooter>
    </>
  );
}