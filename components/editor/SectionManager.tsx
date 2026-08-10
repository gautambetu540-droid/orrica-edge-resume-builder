'use client';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { ResumeSectionId, ResumeSettings } from '@/lib/types/resume';
import { SECTION_TITLES } from '@/components/templates/sections';

function SortableRow({
  id,
  visible,
  onToggle,
}: {
  id: ResumeSectionId;
  visible: boolean;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border bg-white px-3 py-2.5"
    >
      <button {...attributes} {...listeners} className="cursor-grab text-neutral-300 hover:text-neutral-500 touch-none">
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex-1 text-sm font-medium">{id === 'header' ? 'Header' : SECTION_TITLES[id]}</span>
      {visible ? <Eye className="h-3.5 w-3.5 text-neutral-400" /> : <EyeOff className="h-3.5 w-3.5 text-neutral-300" />}
      <Switch checked={visible} onCheckedChange={onToggle} disabled={id === 'header'} />
    </div>
  );
}

export function SectionManager({
  settings,
  updateSettings,
}: {
  settings: ResumeSettings;
  updateSettings: (updater: (s: ResumeSettings) => ResumeSettings) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const ordered = [...settings.sections].sort((a, b) => a.order - b.order);

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ordered.findIndex((s) => s.id === active.id);
    const newIndex = ordered.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(ordered, oldIndex, newIndex).map((s, i) => ({ ...s, order: i }));
    updateSettings((s) => ({ ...s, sections: reordered }));
  }

  function toggle(id: ResumeSectionId) {
    updateSettings((s) => ({
      ...s,
      sections: s.sections.map((sec) => (sec.id === id ? { ...sec, visible: !sec.visible } : sec)),
    }));
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground mb-2">Drag to reorder. Toggle to show or hide a section.</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ordered.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {ordered.map((s) => (
              <SortableRow key={s.id} id={s.id} visible={s.visible} onToggle={() => toggle(s.id)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
