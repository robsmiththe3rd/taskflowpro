import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GTDHeaderProps {
  onToggleChat: () => void;
  isChatOpen: boolean;
}

export default function GTDHeader({ onToggleChat, isChatOpen }: GTDHeaderProps) {
  return (
    <div 
      className="relative text-white p-8 text-center overflow-hidden"
      style={{ background: 'var(--gtd-header)' }}
    >
      {/* Background overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1"></div>
          <h1 className="text-4xl font-bold">🚀 Getting Things Done System</h1>
          <div className="flex-1 flex justify-end">
            <Button
              onClick={onToggleChat}
              variant="outline"
              size="icon"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              data-testid="button-toggle-chat"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto">
          <p className="text-lg font-medium mb-2">Life Purpose:</p>
          <p className="text-base leading-relaxed">
            LEAD the US into a new way of working - where money is distributed by skills and not whether you own a business or are an employee - where you can pick up projects based on your abilities and get paid on results and not based on finding a "job"
          </p>
        </div>
      </div>
    </div>
  );
}