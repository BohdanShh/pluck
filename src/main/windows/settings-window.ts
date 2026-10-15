import path from 'node:path';

import { app, BrowserWindow } from 'electron';

let settingsWindow: BrowserWindow | null = null;

function showSettingsWindow() {
  settingsWindow?.show();
  app.focus({ steal: true });
}

function createSettingsWindow() {
  settingsWindow = new BrowserWindow({
    width: 420,
    height: 210,
    useContentSize: true,
    show: false,
    title: 'Settings',
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    vibrancy: 'window',
    webPreferences: {
      preload: path.join(import.meta.dirname, 'preload.cjs'),
    },
  });

  settingsWindow.once('ready-to-show', showSettingsWindow);

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    settingsWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}src/renderer/index.html`);
  } else {
    settingsWindow.loadFile(path.join(import.meta.dirname, '../dist/src/renderer/index.html'));
  }
}

export function openSettingsWindow() {
  if (settingsWindow) {
    showSettingsWindow();
  } else {
    createSettingsWindow();
  }
}
