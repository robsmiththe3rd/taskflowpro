import { ReactNode, useState } from "react";
import { ChevronRight } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  icon: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({ 
  title, 
  icon, 
  children, 
  defaultOpen = false 
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 bg-card hover:bg-accent/50 transition-all duration-300 border-l-4 border-transparent hover:border-primary"
        data-testid={`button-toggle-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        </div>
        <ChevronRight 
          className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
            isOpen ? 'rotate-90' : ''
          }`}
        />
      </button>
      
      <div 
        className={`transition-all duration-300 bg-muted/30 ${
          isOpen ? 'max-h-96 opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}