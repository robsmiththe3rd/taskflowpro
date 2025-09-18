import CollapsibleSection from '../CollapsibleSection';

export default function CollapsibleSectionExample() {
  return (
    <div className="max-w-4xl mx-auto">
      <CollapsibleSection 
        title="Next Actions" 
        icon="⚡" 
        defaultOpen={true}
      >
        <div className="space-y-4">
          <p>Sample content inside the collapsible section.</p>
          <p>This demonstrates the smooth expand/collapse animation.</p>
        </div>
      </CollapsibleSection>
      
      <CollapsibleSection 
        title="Projects" 
        icon="📁"
      >
        <div className="space-y-4">
          <p>Another section that starts collapsed.</p>
        </div>
      </CollapsibleSection>
    </div>
  );
}