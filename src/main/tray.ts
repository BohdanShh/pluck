import { rm } from 'node:fs/promises';

import { clipboard, Menu, nativeImage, Tray } from 'electron';

import { captureScreen } from './lib/capture-screen';
import { recognizeText } from './lib/recognize-text';

// Kept in a variable so the garbage collector doesn't remove the icon
let tray: Tray;

let isPlucking = false;

async function pluckText() {
  if (isPlucking) return;

  isPlucking = true;

  try {
    const imagePath = await captureScreen();

    if (!imagePath) return;

    const text = await recognizeText(imagePath);
    rm(imagePath, { force: true });

    if (text) clipboard.writeText(text);
  } finally {
    isPlucking = false;
  }
}

export function createTray() {
  tray = new Tray(nativeImage.createEmpty());

  tray.setTitle('Pluck');
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: 'Pluck Text', click: pluckText },
      { type: 'separator' },
      { label: 'Quit Pluck', role: 'quit' },
    ])
  );
}
