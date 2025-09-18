import GoalCard from '../GoalCard';

export default function GoalCardExample() {
  const sampleGoals = [
    {
      id: '1',
      text: 'Transform the US work culture to value skills over traditional employment structures',
      timeframe: 'vision' as const,
      createdAt: new Date(),
    },
    {
      id: '2',
      text: 'Build a platform connecting skilled individuals with project-based opportunities',
      timeframe: '3_5_year' as const,
      createdAt: new Date(),
    },
    {
      id: '3',
      text: 'Bobby established in Virginia and leading a happy, not all internal, life',
      timeframe: '1_2_year' as const,
      createdAt: new Date(),
    },
  ];

  const handleEdit = (goal: any) => {
    console.log('Editing goal:', goal.text);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 p-6">
      {sampleGoals.map(goal => (
        <GoalCard 
          key={goal.id}
          goal={goal}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
}