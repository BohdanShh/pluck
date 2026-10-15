import { globalShortcut } from 'electron';

import { getSettings, updateSettings } from './settings/store';
import { pluckText, updateMenu } from './tray/tray';

const FUNCTION_KEY = /^F([1-9]|1\d|2[0-4])$/;

function validateShortcut(accelerator: string) {
  const parts = accelerator.split('+');

  if (FUNCTION_KEY.test(parts.at(-1) ?? '')) return null;
  if (!['Control', 'Alt', 'Command'].some(modifier => parts.includes(modifier))) {
    return 'Use ⌘, ⌃ or ⌥ in the shortcut';
  }

  return null;
}

function register(accelerator: string) {
  try {
    return globalShortcut.register(accelerator, pluckText);
  } catch {
    return false;
  }
}

export function registerPluckTextShortcut() {
  const { pluckTextShortcut } = getSettings();

  if (globalShortcut.isRegistered(pluckTextShortcut)) return;

  if (!register(pluckTextShortcut)) {
    console.error(`Failed to register shortcut ${pluckTextShortcut}`);
  }
}

export function unregisterPluckTextShortcut() {
  globalShortcut.unregister(getSettings().pluckTextShortcut);
}

export function changePluckTextShortcut(accelerator: string) {
  const error = validateShortcut(accelerator);

  if (error) return error;

  const { pluckTextShortcut } = getSettings();

  if (accelerator === pluckTextShortcut) return null;
  if (!register(accelerator)) return 'Shortcut is already in use';

  globalShortcut.unregister(pluckTextShortcut);
  updateSettings({ pluckTextShortcut: accelerator });
  updateMenu();

  return null;
}
