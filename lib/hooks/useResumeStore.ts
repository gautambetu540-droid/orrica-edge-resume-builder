'use client';

import { create } from 'zustand';
import { ResumeData, ResumeSettings, TemplateId } from '@/lib/types/resume';
import { toast } from '@/components/ui/toaster';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface ResumeStoreState {
  resumeId: string | null;
  title: string;
  data: ResumeData;
  settings: ResumeSettings;
  saveStatus: SaveStatus;
  lastSavedAt: number | null;
  _timer: ReturnType<typeof setTimeout> | null;

  init: (args: { id: string; title: string; data: ResumeData; settings: ResumeSettings }) => void;
  updateData: (updater: (d: ResumeData) => ResumeData) => void;
  updateSettings: (updater: (s: ResumeSettings) => ResumeSettings) => void;
  setTemplate: (template: TemplateId) => void;
  setTitle: (title: string) => void;
  flushSave: () => Promise<void>;
}

const AUTOSAVE_DELAY_MS = 1200;

export const useResumeStore = create<ResumeStoreState>((set, get) => ({
  resumeId: null,
  title: 'Untitled Resume',
  data: {} as ResumeData,
  settings: {} as ResumeSettings,
  saveStatus: 'idle',
  lastSavedAt: null,
  _timer: null,

  init: ({ id, title, data, settings }) => {
    set({ resumeId: id, title, data, settings, saveStatus: 'idle' });
  },

  updateData: (updater) => {
    set((s) => ({ data: updater(s.data) }));
    scheduleSave(set, get);
  },

  updateSettings: (updater) => {
    set((s) => ({ settings: updater(s.settings) }));
    scheduleSave(set, get);
  },

  setTemplate: (template) => {
    set((s) => ({ settings: { ...s.settings, template } }));
    scheduleSave(set, get);
  },

  setTitle: (title) => {
    set({ title });
    scheduleSave(set, get);
  },

  flushSave: async () => {
    const { _timer } = get();
    if (_timer) clearTimeout(_timer);
    await doSave(set, get);
  },
}));

function scheduleSave(
  set: (partial: Partial<ResumeStoreState>) => void,
  get: () => ResumeStoreState
) {
  const { _timer } = get();
  if (_timer) clearTimeout(_timer);
  const timer = setTimeout(() => doSave(set, get), AUTOSAVE_DELAY_MS);
  set({ _timer: timer });
}

async function doSave(
  set: (partial: Partial<ResumeStoreState>) => void,
  get: () => ResumeStoreState
) {
  const { resumeId, title, data, settings } = get();
  if (!resumeId) return;

  set({ saveStatus: 'saving' });
  try {
    const res = await fetch(`/api/resume/${resumeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, resume_data: data, template: settings.template, settings }),
    });
    if (!res.ok) throw new Error('save failed');
    set({ saveStatus: 'saved', lastSavedAt: Date.now() });
  } catch {
    set({ saveStatus: 'error' });
    toast({
      title: "Couldn't save your changes",
      description: "We'll retry automatically — check your connection.",
      variant: 'error',
    });
  }
}
