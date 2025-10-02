import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, Project, Goal, Area } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import GTDHeader from "./GTDHeader";
import CollapsibleSection from "./CollapsibleSection";
import TaskSection from "./TaskSection";
import ProjectCard from "./ProjectCard";
import GoalCard from "./GoalCard";
import AIChat from "./AIChat";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import AddProjectForm from "./forms/AddProjectForm";
import AddGoalForm from "./forms/AddGoalForm";
import AddAreaForm from "./forms/AddAreaForm";
import EditAreaForm from "./forms/EditAreaForm";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { and } from "drizzle-orm";


export default function GTDApp() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Dialog states for manual entry
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false);
  const [goalTimeframe, setGoalTimeframe] = useState<string>('1_2_year');
  
  // Area dialog states
  const [isAddAreaDialogOpen, setIsAddAreaDialogOpen] = useState(false);
  const [isEditAreaDialogOpen, setIsEditAreaDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [isDeleteAreaDialogOpen, setIsDeleteAreaDialogOpen] = useState(false);
  const [deletingArea, setDeletingArea] = useState<Area | null>(null);

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

  const { data: areas = [], isLoading: areasLoading } = useQuery<Area[]>({
    queryKey: ['/api/areas'],
  });

  // Mutation for reordering areas
  const reorderAreasMutation = useMutation({
    mutationFn: async (areaOrders: { id: string; order: number }[]) => {
      const response = await fetch('/api/areas/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ areaOrders }),
      });
      if (!response.ok) {
        throw new Error('Failed to reorder areas');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/areas'] });
      toast({
        title: "Areas reordered",
        description: "Areas have been successfully reordered.",
      });
    },
    onError: (error) => {
      console.error('Error reordering areas:', error);
      toast({
        title: "Error",
        description: "Failed to reorder areas. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter states
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);
  const [areaFilterOrder, setAreaFilterOrder] = useState<string[]>([]);
  const [draggedAreaId, setDraggedAreaId] = useState<string | null>(null);
  const [draggedSortAreaId, setDraggedSortAreaId] = useState<string | null>(null);
  const [dragOverAreaId, setDragOverAreaId] = useState<string | null>(null);

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

  // Get areas that have projects assigned
  const getAreasWithProjects = () => {
    const areaIds = new Set(projects.filter(p => p.areaId).map(p => p.areaId));
    return areas.filter(area => areaIds.has(area.id));
  };

  // Get filtered projects based on selected areas
  const getFilteredProjects = () => {
    if (selectedAreaIds.length === 0) {
      return projects;
    }
    return projects.filter(project => 
      selectedAreaIds.includes(project.areaId || '')
    );
  };

  // Sort projects by area filter order and then by area
  const getSortedProjects = () => {
    const filteredProjects = getFilteredProjects();
    
    // Sort by area filter order (leftmost filter = topmost projects)
    const projectsCopy = [...filteredProjects];
    return projectsCopy.sort((a, b) => {
      const aAreaIndex = areaFilterOrder.indexOf(a.areaId || '');
      const bAreaIndex = areaFilterOrder.indexOf(b.areaId || '');
      
      // Projects without area come first
      if (!a.areaId && b.areaId) return -1;
      if (a.areaId && !b.areaId) return 1;
      if (!a.areaId && !b.areaId) return 0;
      
      // Sort by filter order
      if (aAreaIndex !== bAreaIndex) {
        if (aAreaIndex === -1) return 1;
        if (bAreaIndex === -1) return -1;
        return aAreaIndex - bAreaIndex;
      }
      
      return 0;
    });
  };

  // Handle area filter toggle
  const handleAreaFilterToggle = (areaId: string) => {
    setSelectedAreaIds(prev => {
      if (prev.includes(areaId)) {
        return prev.filter(id => id !== areaId);
      } else {
        return [...prev, areaId];
      }
    });
  };

  // Get area color for badges (stable color based on area ID)
  const getAreaFilterColor = (areaId: string, isSelected: boolean) => {
    // Create a simple hash from area ID for stable colors
    const hash = areaId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      'bg-chart-1 text-white',
      'bg-chart-2 text-white', 
      'bg-chart-3 text-white',
      'bg-chart-4 text-white',
      'bg-chart-5 text-white',
    ];
    
    const baseColor = colors[hash % colors.length] || 'bg-chart-1 text-white';
    return isSelected ? baseColor : baseColor + ' opacity-50';
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, areaId: string) => {
    setDraggedAreaId(areaId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetAreaId: string) => {
    e.preventDefault();
    
    if (!draggedAreaId || draggedAreaId === targetAreaId) {
      setDraggedAreaId(null);
      return;
    }

    setAreaFilterOrder(prev => {
      const newOrder = [...prev];
      const draggedIndex = newOrder.indexOf(draggedAreaId);
      const targetIndex = newOrder.indexOf(targetAreaId);
      
      if (draggedIndex > -1 && targetIndex > -1) {
        // Remove dragged item and insert at target position
        newOrder.splice(draggedIndex, 1);
        const adjustedTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
        newOrder.splice(adjustedTargetIndex, 0, draggedAreaId);
      }
      
      return newOrder;
    });
    
    setDraggedAreaId(null);
  };

  // Drag and drop handlers for area sorting
  const handleAreaSortDragStart = (e: React.DragEvent, areaId: string) => {
    setDraggedSortAreaId(areaId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', areaId);
    console.log('Drag started for area:', areaId);
  };

  const handleAreaSortDragEnd = () => {
    setDraggedSortAreaId(null);
    setDragOverAreaId(null);
    console.log('Drag ended, cleanup completed');
  };


  const handleAreaSortDragLeave = (e: React.DragEvent) => {
    // Only clear if we're actually leaving the element
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverAreaId(null);
    }
  };

  const handleAreaSortDrop = (e: React.DragEvent, targetAreaId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Drop event triggered. Target:', targetAreaId, 'Dragged:', draggedSortAreaId);
    
    if (!draggedSortAreaId || draggedSortAreaId === targetAreaId) {
      setDraggedSortAreaId(null);
      setDragOverAreaId(null);
      return;
    }

    // Find the current order of areas
    const sortedAreas = [...areas].sort((a, b) => a.order - b.order);
    
    const draggedIndex = sortedAreas.findIndex(area => area.id === draggedSortAreaId);
    const targetIndex = sortedAreas.findIndex(area => area.id === targetAreaId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      console.error('Could not find dragged or target area');
      setDraggedSortAreaId(null);
      setDragOverAreaId(null);
      return;
    }

    console.log('Reordering areas. From index:', draggedIndex, 'to index:', targetIndex);

    // Create new order array
    const newOrder = [...sortedAreas];
    const [draggedArea] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedArea);
    
    // Generate new order values
    const areaOrders = newOrder.map((area, index) => ({
      id: area.id,
      order: index + 1
    }));
    
    console.log('Sending reorder request:', areaOrders);
    
    // Send the reorder request
    reorderAreasMutation.mutate(areaOrders);
    setDraggedSortAreaId(null);
    setDragOverAreaId(null);
  };

  const sortedProjects = getSortedProjects();
  const areasWithProjects = getAreasWithProjects();

  // Group projects by area for visual grouping when multiple areas are selected
  const getGroupedProjects = () => {
    // Only group when multiple areas are selected
    if (selectedAreaIds.length <= 1) {
      return { shouldGroup: false, groups: [] };
    }

    const groups: Array<{ areaId: string | null; areaTitle: string; projects: Project[]; areaColor: string }> = [];
    
    // Create groups based on areaFilterOrder for selected areas
    for (const areaId of areaFilterOrder) {
      if (selectedAreaIds.includes(areaId)) {
        const area = areas.find(a => a.id === areaId);
        const areaProjects = sortedProjects.filter(p => p.areaId === areaId);
        
        if (areaProjects.length > 0 && area) {
          groups.push({
            areaId,
            areaTitle: area.title,
            projects: areaProjects,
            areaColor: getAreaFilterColor(areaId, true).split(' ')[0] // Extract just the bg color
          });
        }
      }
    }
    
    // Add projects without area if any
    const projectsWithoutArea = sortedProjects.filter(p => !p.areaId);
    if (projectsWithoutArea.length > 0) {
      groups.unshift({
        areaId: null,
        areaTitle: 'No Area',
        projects: projectsWithoutArea,
        areaColor: 'bg-muted'
      });
    }
    
    return { shouldGroup: true, groups };
  };

  const { shouldGroup, groups } = getGroupedProjects();

  // Initialize area filter order when areas with projects change
  useEffect(() => {
    const currentAreaIds = areasWithProjects.map(area => area.id);
    setAreaFilterOrder(prev => {
      const newOrder = Array.from(new Set([...prev, ...currentAreaIds]));
      return newOrder.filter(id => currentAreaIds.includes(id));
    });
  }, [areasWithProjects.map(a => a.id).join(',')]);

  // Show loading state
  if (tasksLoading || projectsLoading || goalsLoading || areasLoading) {
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
              
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    🔥 Quarterly Goals
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGoalTimeframe('quarterly');
                      setIsAddGoalDialogOpen(true);
                    }}
                    data-testid="button-add-goal-quarterly"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Goal
                  </Button>
                </h4>
                <div className="space-y-3">
                  {goals
                    .filter((goal: Goal) => goal.timeframe === 'quarterly')
                    .map((goal: Goal) => (
                      <GoalCard key={goal.id} goal={goal} />
                    ))
                  }
                  {goals.filter((goal: Goal) => goal.timeframe === 'quarterly').length === 0 && (
                    <div className="bg-card border border-card-border rounded-lg p-4 text-center text-muted-foreground">
                      No quarterly goals yet
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    ✅ Weekly Objectives
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGoalTimeframe('weekly');
                      setIsAddGoalDialogOpen(true);
                    }}
                    data-testid="button-add-goal-weekly"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Objective
                  </Button>
                </h4>
                <div className="space-y-3">
                  {goals
                    .filter((goal: Goal) => goal.timeframe === 'weekly')
                    .map((goal: Goal) => (
                      <GoalCard key={goal.id} goal={goal} />
                    ))
                  }
                  {goals.filter((goal: Goal) => goal.timeframe === 'weekly').length === 0 && (
                    <div className="bg-card border border-card-border rounded-lg p-4 text-center text-muted-foreground">
                      No weekly objectives yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Next Actions Section */}
          <CollapsibleSection title="Next Actions" icon="⚡" defaultOpen={false}>
            <div className="space-y-6">
              <TaskSection 
                title="High Focus/Important"
                tasks={getTasksByCategory('high_focus')}
                onToggleTask={handleToggleTask}
              />
              <TaskSection 
                title="Afternoon Work"
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
              <div className="flex items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-semibold text-foreground">Active Projects</h4>
                  
                  {areasWithProjects.length > 0 && (
                    <div className="flex items-center gap-2">
                      {areaFilterOrder
                        .filter(areaId => areasWithProjects.some(area => area.id === areaId))
                        .map(areaId => {
                          const area = areasWithProjects.find(a => a.id === areaId);
                          if (!area) return null;
                          
                          const isSelected = selectedAreaIds.includes(area.id);
                          const isDragging = draggedAreaId === area.id;
                          
                          return (
                            <button
                              key={area.id}
                              draggable
                              onClick={() => handleAreaFilterToggle(area.id)}
                              onDragStart={(e) => handleDragStart(e, area.id)}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, area.id)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-all hover:opacity-80 cursor-grab active:cursor-grabbing ${
                                getAreaFilterColor(area.id, isSelected)
                              } ${isDragging ? 'opacity-50 scale-95' : ''}`}
                              data-testid={`filter-badge-${area.id}`}
                              title="Click to filter, drag to reorder"
                            >
                              {area.title}
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>
                
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
              {sortedProjects.length > 0 ? (
                shouldGroup ? (
                  <div className="space-y-6">
                    {groups.map((group) => (
                      <div key={group.areaId || 'no-area'} className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-border">
                          <div className={`w-3 h-3 rounded-full ${group.areaColor}`}></div>
                          <h4 className="font-medium text-foreground">
                            {group.areaTitle}
                          </h4>
                          <span className="text-sm text-muted-foreground">({group.projects.length})</span>
                        </div>
                        <div className="space-y-4 pl-5">
                          {group.projects.map((project: Project) => (
                            <ProjectCard key={project.id} project={project} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedProjects.map((project: Project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                )
              ) : projects.length === 0 ? (
                <div className="bg-card border border-card-border rounded-lg p-4 text-center text-muted-foreground">
                  No projects yet
                </div>
              ) : (
                <div className="bg-card border border-card-border rounded-lg p-4 text-center text-muted-foreground">
                  No projects match current filters
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Areas of Focus Section */}
          <CollapsibleSection title="Areas of Focus" icon="🎯">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Manage your areas of focus to organize projects and maintain clarity on different life domains.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddAreaDialogOpen(true)}
                  data-testid="button-add-area"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Area
                </Button>
              </div>
              
              {areas.length > 0 ? (
                <div className="space-y-4">
                  {areas
                    .sort((a, b) => a.order - b.order)
                    .map((area) => {
                      const isDragging = draggedSortAreaId === area.id;
                      return (
                        <Card 
                          key={area.id} 
                          className={`group hover-elevate transition-all duration-200 ${
                            isDragging ? 'opacity-50 scale-95' : ''
                          } ${
                            dragOverAreaId === area.id ? 'ring-2 ring-primary ring-offset-2' : ''
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.dataTransfer.dropEffect = 'move';
                            if (draggedSortAreaId && draggedSortAreaId !== area.id) {
                              setDragOverAreaId(area.id);
                            }
                          }}
                          onDragLeave={handleAreaSortDragLeave}
                          onDrop={(e) => handleAreaSortDrop(e, area.id)}
                          data-testid={`card-area-${area.id}`}
                        >
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div 
                                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                                draggable
                                onDragStart={(e) => handleAreaSortDragStart(e, area.id)}
                                onDragEnd={handleAreaSortDragEnd}
                              >
                                <GripVertical className="h-4 w-4" />
                              </div>
                              <div className="space-y-1 flex-1 min-w-0">
                                <CardTitle className="text-lg font-semibold" data-testid={`area-title-${area.id}`}>
                                  {area.title}
                                </CardTitle>
                                {area.description && (
                                  <CardDescription data-testid={`area-description-${area.id}`}>
                                    {area.description}
                                  </CardDescription>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setEditingArea(area);
                                  setIsEditAreaDialogOpen(true);
                                }}
                                data-testid={`button-edit-area-${area.id}`}
                                title="Edit area"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => {
                                  setDeletingArea(area);
                                  setIsDeleteAreaDialogOpen(true);
                                }}
                                data-testid={`button-delete-area-${area.id}`}
                                title="Delete area"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                        </Card>
                      );
                    })}
                </div>
              ) : (
                <Card className="text-center text-muted-foreground">
                  <CardContent className="p-8">
                    <div className="space-y-2">
                      <p>No areas of focus yet</p>
                      <p className="text-sm">Areas help you organize projects and maintain clarity on different life domains.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
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

      {/* Area Dialogs */}
      <Dialog open={isAddAreaDialogOpen} onOpenChange={setIsAddAreaDialogOpen}>
        <DialogContent>
          <AddAreaForm onClose={() => setIsAddAreaDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditAreaDialogOpen} onOpenChange={setIsEditAreaDialogOpen}>
        <DialogContent>
          {editingArea && (
            <EditAreaForm 
              area={editingArea}
              onClose={() => {
                setIsEditAreaDialogOpen(false);
                setEditingArea(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteAreaDialogOpen} onOpenChange={setIsDeleteAreaDialogOpen}>
        <DialogContent>
          {deletingArea && (
            <DeleteConfirmDialog
              type="area"
              itemId={deletingArea.id}
              itemName={deletingArea.title}
              onClose={() => {
                setIsDeleteAreaDialogOpen(false);
                setDeletingArea(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}