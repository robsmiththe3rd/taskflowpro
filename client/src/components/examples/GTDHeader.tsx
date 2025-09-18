import GTDHeader from '../GTDHeader';

export default function GTDHeaderExample() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--gtd-gradient)' }}>
      <GTDHeader 
        onToggleChat={() => console.log('Toggle chat clicked')}
        isChatOpen={false}
      />
    </div>
  );
}