import type { StoredSettings } from '../../shared/settings';
import { validateShortcut } from '../lib/validate-shortcut';

export const DEFAULT_SETTINGS: StoredSettings = {
  keepLineBreaks: true,
  pluckTextShortcut: 'Shift+Command+T',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidShortcut(value: unknown): value is string {
  return typeof value === 'string' && value !== '' && validateShortcut(value) === null;
}

export function parseSettings(value: unknown): StoredSettings {
  const raw = isRecord(value) ? value : {};

  return {
    keepLineBreaks:
      typeof raw.keepLineBreaks === 'boolean'
        ? raw.keepLineBreaks
        : DEFAULT_SETTINGS.keepLineBreaks,
    pluckTextShortcut: isValidShortcut(raw.pluckTextShortcut)
      ? raw.pluckTextShortcut
      : DEFAULT_SETTINGS.pluckTextShortcut,
  };
}
