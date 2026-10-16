import type { StoredSettings } from '../../shared/settings';
import { readJsonFile, writeJsonFile } from '../system/json-file';
import { parseSettings } from './parse-settings';

const SETTINGS_FILE = 'settings.json';

type SettingsListener = (settings: StoredSettings, previous: StoredSettings) => void;

const listeners = new Set<SettingsListener>();

let settings: StoredSettings | null = null;

export function getSettings() {
  settings ??= parseSettings(readJsonFile(SETTINGS_FILE));

  return settings;
}

export function updateSettings(patch: Partial<StoredSettings>) {
  const previous = getSettings();

  settings = { ...previous, ...patch };
  writeJsonFile(SETTINGS_FILE, settings);

  for (const listener of listeners) listener(settings, previous);
}

export function onSettingsChange(listener: SettingsListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
