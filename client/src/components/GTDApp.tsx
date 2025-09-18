import { useState } from "react";
import { Task } from "@shared/schema";
import GTDHeader from "./GTDHeader";
import CollapsibleSection from "./CollapsibleSection";
import TaskSection from "./TaskSection";
import ProjectCard from "./ProjectCard";
import GoalCard from "./GoalCard";
import AIChat from "./AIChat";

// Mock data to demonstrate the functionality - todo: remove mock functionality
const initialTasks: Task[] = [
  {
    id: '1',
    text: "Look at Bryan's stuff, learn the repositories, finish spreadsheet",
    category: 'high_focus',
    completed: false,
    completedAt: null,
    createdAt: new Date('2024-09-15'),
  },
  {
    id: '2',
    text: "Get to help tickets",
    category: 'high_focus',
    completed: false,
    completedAt: null,
    createdAt: new Date('2024-09-15'),
  },
  {
    id: '3',
    text: "Review Gabby's SOP edits",
    category: 'high_focus',
    completed: false,
    completedAt: null,
    createdAt: new Date('2024-09-15'),
  },
  {
    id: '4',
    text: "Talk with Gabby about the SOPs - Completed Tues 9/16 1:30pm",
    category: 'quick_work',
    completed: true,
    completedAt: new Date('2024-09-16T13:30:00'),
    createdAt: new Date('2024-09-15'),
  },
  {
    id: '5',
    text: "Enter help ticket for deliverable repositories table not working",
    category: 'quick_work',
    completed: false,
    completedAt: null,
    createdAt: new Date('2024-09-15'),
  },
  {
    id: '6',
    text: "Sign up for Visible phone plans for you and wife",
    category: 'quick_personal',
    completed: false,
    completedAt: null,
    createdAt: new Date('2024-09-15'),
  },
  {
    id: '7',
    text: "Research GTD communities to join",
    category: 'quick_personal',
    completed: false,
    completedAt: null,
    createdAt: new Date('2024-09-15'),
  },
];

// Mock projects - todo: remove mock functionality
const initialProjects = [
  {
    id: '1',
    title: 'Home Office Organization',
    status: 'active' as const,
    notes: 'Create a productive workspace that supports focus and creativity',
    createdAt: new Date('2024-09-10'),
  },
  {
    id: '2',
    title: 'Team Process Documentation',
    status: 'active' as const,
    notes: 'Document standard operating procedures for the team',
    createdAt: new Date('2024-09-12'),
  },
];

// Mock goals - todo: remove mock functionality
const initialGoals = [
  {
    id: '1',
    text: 'What does this transformation look like when it\'s working?',
    timeframe: 'vision' as const,
    createdAt: new Date('2024-09-01'),
  },
  {
    id: '2',
    text: 'Major milestones toward the vision',
    timeframe: '3_5_year' as const,
    createdAt: new Date('2024-09-01'),
  },
  {
    id: '3',
    text: 'Bobby established in Virginia and leading a happy, not all internal, life',
    timeframe: '1_2_year' as const,
    createdAt: new Date('2024-09-01'),
  },
];

export default function GTDApp() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleTask = (id: string, completed: boolean) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { 
              ...task, 
              completed, 
              completedAt: completed ? new Date() : null 
            }
          : task
      )
    );
    console.log(`Task ${id} marked as ${completed ? 'completed' : 'incomplete'}`);
  };

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
    console.log('Chat toggled:', !isChatOpen);
  };

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => task.category === category);
  };

  return (
    <div 
      className="min-h-screen"
      style={{ background: 'var(--gtd-gradient)' }}
    >
      <div className="max-w-6xl mx-auto bg-background/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden m-4">
        <GTDHeader onToggleChat={handleToggleChat} isChatOpen={isChatOpen} />
        
        <div className="pb-6">
          {/* Vision & Goals Section */}
          <CollapsibleSection title="Vision & Goals" icon="🏔️">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  🏔️ 10-20 Year Vision
                </h4>
                {initialGoals
                  .filter(goal => goal.timeframe === 'vision')
                  .map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))
                }
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  🌟 3-5 Year Goals
                </h4>
                {initialGoals
                  .filter(goal => goal.timeframe === '3_5_year')
                  .map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))
                }
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  🌟 1-2 Year Goals
                </h4>
                {initialGoals
                  .filter(goal => goal.timeframe === '1_2_year')
                  .map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))
                }
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
          <CollapsibleSection title="Projects" icon="📁">
            <div className="space-y-4">
              {initialProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
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
      </div>

      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}