'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_SETTINGS, EMPTY_RESUME_DATA, ResumeData, ResumeSettings } from '@/lib/types/resume';

const STORAGE_KEY = 'orrica_edge_draft_v1';

interface DraftState {
  data: ResumeData;
  settings: ResumeSettings;
}

function loadDraft(): DraftState {
  if (typeof window === 'undefined') return { data: EMPTY_RESUME_DATA, settings: DEFAULT_SETTINGS };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { data: EMPTY_RESUME_DATA, settings: DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return { data: { ...EMPTY_RESUME_DATA, ...parsed.data }, settings: { ...DEFAULT_SETTINGS, ...parsed.settings } };
  } catch {
    return { data: EMPTY_RESUME_DATA, settings: DEFAULT_SETTINGS };
  }
}

/**
 * Keeps resume-in-progress data in localStorage so a visitor can complete
 * the whole wizard before creating an account. When they're ready to save
 * permanently (or hit Finish), the caller reads `data`/`settings` and POSTs
 * them to /api/resume once authenticated.
 */
export function useDraftResume() {
  const [state, setState] = useState<DraftState>(() => loadDraft());
  const hydrated = useRef(false);

  useEffect(() => {
    hydrated.current = true;
    setState(loadDraft());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateData = useCallback((updater: (d: ResumeData) => ResumeData) => {
    setState((s) => ({ ...s, data: updater(s.data) }));
  }, []);

  const updateSettings = useCallback((updater: (s: ResumeSettings) => ResumeSettings) => {
    setState((s) => ({ ...s, settings: updater(s.settings) }));
  }, []);

  const clearDraft = useCallback(() => {
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
    setState({ data: EMPTY_RESUME_DATA, settings: DEFAULT_SETTINGS });
  }, []);

  return { data: state.data, settings: state.settings, updateData, updateSettings, clearDraft };
}
