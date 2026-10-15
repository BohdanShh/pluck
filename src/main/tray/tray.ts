import { rm } from 'node:fs/promises';

import { clipboard, Tray } from 'electron';

import { captureScreen } from '../lib/capture-screen';
import { playSound } from '../lib/play-sound';
import { recognizeText } from '../lib/recognize-text';
import { getSettings } from '../settings/store';
import { checkForUpdates } from '../updater';
import { openAboutWindow } from '../windows/about-window';
import { openSettingsWindow } from '../windows/settings-window';
import { buildMenu } from './menu';
import { createTrayIcon } from './tray-icon';

// Kept in a variable so the garbage collector doesn't remove the icon
let tray: Tray;

let isPlucking = false;

export async function pluckText() {
  if (isPlucking) return;

  isPlucking = true;

  try {
    const imagePath = await captureScreen();

    if (!imagePath) return;

    const text = await recognizeText(imagePath);
    await rm(imagePath, { force: true });

    if (!text) {
      playSound('failure');
      return;
    }

    clipboard.writeText(getSettings().keepLineBreaks ? text : text.replace(/\s*\n\s*/g, ' '));
    playSound('success');
  } finally {
    isPlucking = false;
  }
}

export function updateMenu() {
  tray.setContextMenu(
    buildMenu({
      shortcut: getSettings().pluckTextShortcut,
      onPluckText: pluckText,
      onOpenSettings: openSettingsWindow,
      onOpenAbout: openAboutWindow,
      onCheckForUpdates: checkForUpdates,
    })
  );
}

export function createTray() {
  tray = new Tray(createTrayIcon());
  updateMenu();
}
