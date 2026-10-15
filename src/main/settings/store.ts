import { DEFAULT_PLUCK_TEXT_SHORTCUT } from '../constants/shortcuts';
import { readJsonFile, writeJsonFile } from '../lib/json-file';

const SETTINGS_FILE = 'settings.json';

type StoredSettings = {
  keepLineBreaks: boolean;
  pluckTextShortcut: string;
};

export type AppSettings = StoredSettings & {
  launchAtLogin: boolean;
};

const DEFAULT_SETTINGS: StoredSettings = {
  keepLineBreaks: true,
  pluckTextShortcut: DEFAULT_PLUCK_TEXT_SHORTCUT,
};

let settings: StoredSettings | null = null;

export function getSettings() {
  settings ??= readJsonFile(SETTINGS_FILE, DEFAULT_SETTINGS);

  return settings;
}

export function updateSettings(patch: Partial<StoredSettings>) {
  settings = { ...getSettings(), ...patch };

  writeJsonFile(SETTINGS_FILE, settings);
}
