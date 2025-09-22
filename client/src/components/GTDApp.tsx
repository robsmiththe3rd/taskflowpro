import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Task, Project, Goal } from "@shared/schema";
import GTDHeader from "./GTDHeader";
import CollapsibleSection from "./CollapsibleSection";
import TaskSection from "./TaskSection";
import ProjectCard from "./ProjectCard";
import GoalCard from "./GoalCard";
import AIChat from "./AIChat";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AddProjectForm from "./forms/AddProjectForm";
import AddGoalForm from "./forms/AddGoalForm";


export default function GTDApp() {
  // Dialog states for manual entry
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false);
  const [goalTimeframe, setGoalTimeframe] = useState<string>('1_2_year');

  // Fetch all data from the API
  const { data: tasks = [], isLoading: tasksLoading, refetch: refetchTasks } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { data: goals = [], isLoading: goalsLoading } = useQuery<Goal[]>({
    queryKey: ['/api/goals'],
  });

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      });
      refetchTasks();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const getTasksByCategory = (category: string) => {
    return tasks.filter((task: Task) => task.category === category);
  };

  // Show loading state
  if (tasksLoading || projectsLoading || goalsLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--gtd-gradient)' }}
      >
        <div className="text-white text-xl">Loading your GTD system...</div>
      </div>
    );
  }


  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--gtd-gradient)' }}
    >
      <div className="flex-1 max-w-6xl mx-auto bg-background/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden m-4 mb-0 flex flex-col">
        <GTDHeader />
        
        <div className="flex-1 pb-6 overflow-y-auto">
          {/* Vision & Goals Section */}
          <CollapsibleSection title="Vision & Goals" icon="🏔️">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    🏔️ 10-20 Year Vision
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGoalTimeframe('vision');
                      setIsAddGoalDialogOpen(true);
                    }}
                    data-testid="button-add-goal-vision"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Vision
                  </Button>
                </h4>
                <div className="space-y-3">
                  {goals
                    .filter((goal: Goal) => goal.timeframe === 'vision')
                    .map((goal: Goal) => (
                      <GoalCard key={goal.id} goal={goal} />
                    ))
                  }
                  {goals.filter((goal: Goal) => goal.timeframe === 'vision').length === 0 && (
                    <div className="bg-card border border-card-border rounded-lg p-4 text-center text-muted-foreground">
                      No vision goals yet
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    🌟 3-5 Year Goals
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGoalTimeframe('3_5_year');
                      setIsAddGoalDialogOpen(true);
                    }}
                    data-testid="button-add-goal-3-5-year"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Goal
                  </Button>
                </h4>
                <div className="space-y-3">
                  {goals
                    .filter((goal: Goal) => goal.timeframe === '3_5_year')
                    .map((goal: Goal) => (
                      <GoalCard key={goal.id} goal={goal} />
                    ))
                  }
                  {goals.filter((goal: Goal) => goal.timeframe === '3_5_year').length === 0 && (
                    <div className="bg-card border border-card-border rounded-lg p-4 text-center text-muted-foreground">
                      No 3-5 year goals yet
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    🌟 1-2 Year Goals
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGoalTimeframe('1_2_year');
                      setIsAddGoalDialogOpen(true);
                    }}
                    data-testid="button-add-goal-1-2-year"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Goal
                  </Button>
                </h4>
                <div className="space-y-3">
                  {goals
                    .filter((goal: Goal) => goal.timeframe === '1_2_year')
                    .map((goal: Goal) => (
                      <GoalCard key={goal.id} goal={goal} />
                    ))
                  }
                  {goals.filter((goal: Goal) => goal.timeframe === '1_2_year').length === 0 && (
                    <div className="bg-card border border-card-border rounded-lg p-4 text-center text-muted-foreground">
                      No 1-2 year goals yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Next Actions Section */}
          <CollapsibleSection title="Next Actions" icon="⚡" defaultOpen={true}>
            <div className="space-y-6">
              <TaskSection 
                title="High Focus/Important"
                tasks={getTasksByCategory('high_focus')}
                onToggleTask={handleToggleTask}
              />
              <TaskSection 
                title="Quick Work"
                tasks={getTasksByCategory('quick_work')}
                onToggleTask={handleToggleTask}
              />
              <TaskSection 
                title="Quick Personal"
                tasks={getTasksByCategory('quick_personal')}
                onToggleTask={handleToggleTask}
              />
              <TaskSection 
                title="Home"
                tasks={getTasksByCategory('home')}
                onToggleTask={handleToggleTask}
              />
            </div>
          </CollapsibleSection>

          {/* Projects Section */}
          <CollapsibleSection title="Projects" icon="🚀">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-foreground">Active Projects</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddProjectDialogOpen(true)}
                  data-testid="button-add-project"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Project
                </Button>
              </div>
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((project: Project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="bg-card border border-card-border rounded-lg p-4 text-center text-muted-foreground">
                  No projects yet
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Areas of Focus Section */}
          <CollapsibleSection title="Areas of Focus" icon="🎯">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-card border border-card-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">Career & Leadership</h4>
                <p className="text-sm text-muted-foreground">
                  Building expertise and influence in transforming work culture
                </p>
              </div>
              <div className="bg-card border border-card-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">Personal Development</h4>
                <p className="text-sm text-muted-foreground">
                  Continuous learning and growth in productivity and leadership
                </p>
              </div>
            </div>
          </CollapsibleSection>

          {/* Waiting For Section */}
          <CollapsibleSection title="Waiting For" icon="⏳">
            <TaskSection 
              title="Pending Items"
              tasks={getTasksByCategory('waiting_for')}
              onToggleTask={handleToggleTask}
            />
          </CollapsibleSection>

          {/* Someday/Maybe Section */}
          <CollapsibleSection title="Someday/Maybe" icon="🌙">
            <TaskSection 
              title="Future Considerations"
              tasks={getTasksByCategory('someday')}
              onToggleTask={handleToggleTask}
            />
          </CollapsibleSection>
        </div>
        
        <AIChat />
      </div>
      
      {/* Manual Entry Dialogs */}
      <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
        <DialogContent>
          <AddProjectForm onClose={() => setIsAddProjectDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isAddGoalDialogOpen} onOpenChange={setIsAddGoalDialogOpen}>
        <DialogContent>
          <AddGoalForm 
            onClose={() => setIsAddGoalDialogOpen(false)}
            defaultTimeframe={goalTimeframe}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}