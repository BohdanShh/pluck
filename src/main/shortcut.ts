import { globalShortcut, type WebContents } from 'electron';

import { validateShortcut } from './lib/validate-shortcut';
import { pluckText } from './pluck';
import { getSettings, updateSettings } from './settings/store';

function register(accelerator: string) {
  try {
    return globalShortcut.register(accelerator, pluckText);
  } catch {
    return false;
  }
}

export function registerShortcut() {
  const { pluckTextShortcut } = getSettings();

  if (globalShortcut.isRegistered(pluckTextShortcut)) return;

  if (!register(pluckTextShortcut)) {
    console.error(`Failed to register shortcut ${pluckTextShortcut}`);
  }
}

export function changeShortcut(accelerator: string) {
  const error = validateShortcut(accelerator);

  if (error) return error;

  const { pluckTextShortcut } = getSettings();

  if (accelerator === pluckTextShortcut) return null;
  if (!register(accelerator)) return 'Shortcut is already in use';

  globalShortcut.unregister(pluckTextShortcut);
  updateSettings({ pluckTextShortcut: accelerator });

  return null;
}

export function pauseShortcut(sender: WebContents) {
  globalShortcut.unregister(getSettings().pluckTextShortcut);
  sender.once('destroyed', registerShortcut);
}

export function resumeShortcut(sender: WebContents) {
  sender.off('destroyed', registerShortcut);
  registerShortcut();
}
