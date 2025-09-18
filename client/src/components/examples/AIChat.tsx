import AIChat from '../AIChat';

export default function AIChatExample() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 p-4">
        <h2>AI Chat Example</h2>
        <p>The chat is now permanently at the bottom:</p>
      </div>
      <AIChat />
    </div>
  );
}