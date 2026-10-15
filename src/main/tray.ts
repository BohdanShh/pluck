import { rm } from 'node:fs/promises';

import { clipboard, Menu, Tray } from 'electron';

import { PLUCK_TEXT_SHORTCUT } from './constants';
import { captureScreen } from './lib/capture-screen';
import { playSound } from './lib/play-sound';
import { recognizeText } from './lib/recognize-text';
import { getSettings, updateSettings } from './settings';
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
    rm(imagePath, { force: true });

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

export function createTray() {
  tray = new Tray(createTrayIcon());

  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: 'Pluck Text', accelerator: PLUCK_TEXT_SHORTCUT, click: pluckText },
      {
        label: 'Keep Line Breaks',
        type: 'checkbox',
        checked: getSettings().keepLineBreaks,
        click: ({ checked }) => updateSettings({ keepLineBreaks: checked }),
      },
      { type: 'separator' },
      { label: 'Quit Pluck', role: 'quit' },
    ])
  );
}
