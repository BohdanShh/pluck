import { readJsonFile, writeJsonFile } from './lib/json-file';

const SETTINGS_FILE = 'settings.json';

type Settings = {
  keepLineBreaks: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  keepLineBreaks: true,
};

let settings: Settings | null = null;

export function getSettings() {
  settings ??= readJsonFile(SETTINGS_FILE, DEFAULT_SETTINGS);

  return settings;
}

export function updateSettings(patch: Partial<Settings>) {
  settings = { ...getSettings(), ...patch };

  writeJsonFile(SETTINGS_FILE, settings);
}
