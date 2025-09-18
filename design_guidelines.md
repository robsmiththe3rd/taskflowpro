# GTD System Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from productivity tools like Notion and Linear, with a focus on clean, functional design that supports focused work and clear task management.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Dark Mode: Deep navy base (220 15% 12%) with soft purple accents (250 50% 65%)
- Light Mode: Clean whites (0 0% 98%) with professional blue tones (220 90% 50%)
- Success states: Soft green (142 76% 36%) for completed tasks
- Chat interface: Distinct purple gradient (250 100% 70% to 280 100% 75%)

### B. Typography
- **Primary**: Inter or similar modern sans-serif via Google Fonts
- **Headers**: Font weights 600-700 for section titles
- **Body**: Font weight 400 for task lists and descriptions
- **Chat**: Slightly smaller font size (14px) for conversational interface

### C. Layout System
**Tailwind Spacing**: Consistent use of units 2, 4, 6, and 8
- Padding: p-4 for cards, p-6 for sections
- Margins: m-2 for list items, m-4 for section spacing
- Gaps: gap-4 for grids, gap-6 for major sections

### D. Component Library

**Core Sections:**
- Collapsible panels with smooth expand/collapse animations
- Clean card-based layout for each GTD category
- Minimalist checkboxes with satisfying completion states
- Drag-and-drop visual feedback with subtle shadows

**AI Chat Integration:**
- Fixed or sliding panel design (right side or bottom)
- Chat bubble interface with distinct styling from main content
- Input field with purple gradient accent matching the theme
- Clear visual separation between AI responses and user inputs

**Task Management:**
- Simple list-based layout for tasks within each category
- Inline editing capabilities with clean form inputs
- Completion states with strikethrough and fade effects
- Priority indicators using subtle color coding

**Navigation:**
- Clean section headers with expand/collapse indicators
- Breadcrumb-style navigation for deeper task organization
- Search functionality integrated into the header area

### E. Interactions
- Minimal animations focusing on state changes and feedback
- Smooth transitions for collapsible sections (300ms ease)
- Subtle hover states for interactive elements
- Loading states for AI chat responses

## Special Considerations

**GTD Methodology Support:**
- Clear visual hierarchy matching GTD categories
- Easy task capture and categorization
- Weekly/daily review interfaces
- Context-based task filtering

**AI Chat Experience:**
- Natural language processing visual feedback
- Clear confirmation when items are added/modified
- Seamless integration without overwhelming the main interface
- Error states for failed AI operations

**Data Persistence:**
- Visual indicators for auto-save states
- Clean loading states during data operations
- Offline capability messaging if applicable

This design prioritizes clarity, focus, and the natural workflow of GTD methodology while incorporating modern AI-assisted task management in a visually cohesive way.