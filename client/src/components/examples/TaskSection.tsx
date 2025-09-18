import TaskSection from '../TaskSection';

export default function TaskSectionExample() {
  const sampleTasks = [
    {
      id: '1',
      text: 'Complete the quarterly report',
      category: 'high_focus' as const,
      completed: false,
      completedAt: null,
      createdAt: new Date(),
    },
    {
      id: '2',
      text: 'Review team standup notes',
      category: 'quick_work' as const,
      completed: true,
      completedAt: new Date(),
      createdAt: new Date(),
    },
    {
      id: '3',
      text: 'Schedule dentist appointment',
      category: 'quick_personal' as const,
      completed: false,
      completedAt: null,
      createdAt: new Date(),
    },
  ];

  const handleToggleTask = (id: string, completed: boolean) => {
    console.log(`Task ${id} toggled to ${completed}`);
  };

  const highFocusTasks = sampleTasks.filter(t => t.category === 'high_focus');
  const quickWorkTasks = sampleTasks.filter(t => t.category === 'quick_work');

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <TaskSection 
        title="High Focus/Important"
        tasks={highFocusTasks}
        onToggleTask={handleToggleTask}
      />
      <TaskSection 
        title="Quick Work"
        tasks={quickWorkTasks}
        onToggleTask={handleToggleTask}
      />
      <TaskSection 
        title="Empty Category"
        tasks={[]}
        onToggleTask={handleToggleTask}
      />
    </div>
  );
}