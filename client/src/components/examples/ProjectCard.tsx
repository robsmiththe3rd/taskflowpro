import ProjectCard from '../ProjectCard';

export default function ProjectCardExample() {
  const sampleProjects = [
    {
      id: '1',
      title: 'Home Office Setup',
      status: 'active' as const,
      notes: 'Setting up ergonomic workspace with standing desk and proper lighting',
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Team Leadership Training',
      status: 'on_hold' as const,
      notes: null,
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'Website Redesign',
      status: 'completed' as const,
      notes: 'Successfully launched new design with improved user experience',
      createdAt: new Date(),
    },
  ];

  const handleEdit = (project: any) => {
    console.log('Editing project:', project.title);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-6">
      {sampleProjects.map(project => (
        <ProjectCard 
          key={project.id}
          project={project}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
}