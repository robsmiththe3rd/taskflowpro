import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableSectionData {
  id: string;
  title: string;
  component: React.ReactNode;
}

interface SortableSectionsProps {
  sections: SortableSectionData[];
}

function SortableSectionWrapper({ 
  id, 
  children 
}: { 
  id: string; 
  children: React.ReactNode; 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  );
}

export default function SortableSections({ sections: initialSections }: SortableSectionsProps) {
  const [sections, setSections] = useState(initialSections);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load saved order from localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem('gtd-section-order');
    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder);
        const reorderedSections = orderIds
          .map((id: string) => initialSections.find(section => section.id === id))
          .filter(Boolean);
        
        // Add any new sections that weren't in saved order
        const existingIds = new Set(orderIds);
        const newSections = initialSections.filter(section => !existingIds.has(section.id));
        
        setSections([...reorderedSections, ...newSections]);
      } catch (error) {
        console.error('Error loading section order:', error);
        setSections(initialSections);
      }
    } else {
      setSections(initialSections);
    }
  }, [initialSections]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Save new order to localStorage
        const orderIds = newOrder.map(item => item.id);
        localStorage.setItem('gtd-section-order', JSON.stringify(orderIds));
        
        return newOrder;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map(section => section.id)}
        strategy={verticalListSortingStrategy}
      >
        {sections.map((section) => (
          <SortableSectionWrapper key={section.id} id={section.id}>
            {section.component}
          </SortableSectionWrapper>
        ))}
      </SortableContext>
    </DndContext>
  );
}