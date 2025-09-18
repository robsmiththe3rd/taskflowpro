import TaskItem from '../TaskItem';

export default function TaskItemExample() {
  const sampleTasks = [
    {
      id: '1',
      text: 'Complete the project proposal',
      category: 'high_focus' as const,
      completed: false,
      completedAt: null,
      createdAt: new Date(),
    },
    {
      id: '2', 
      text: 'Review team feedback - Completed yesterday',
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

  const handleToggle = (id: string, completed: boolean) => {
    console.log(`Task ${id} toggled to ${completed}`);
  };

  return (
    <div className="max-w-2xl mx-auto bg-card border border-card-border rounded-lg">
      {sampleTasks.map(task => (
        <TaskItem 
          key={task.id}
          task={task} 
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}