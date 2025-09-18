import AIChat from '../AIChat';

export default function AIChatExample() {
  return (
    <div className="min-h-screen bg-background p-4">
      <AIChat 
        isOpen={true}
        onClose={() => console.log('Chat closed')}
      />
    </div>
  );
}