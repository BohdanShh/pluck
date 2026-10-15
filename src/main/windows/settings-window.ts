import { app, BrowserWindow } from 'electron';

import { loadRenderer, PRELOAD_PATH } from './load-renderer';

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
      preload: PRELOAD_PATH,
    },
  });

  settingsWindow.once('ready-to-show', showSettingsWindow);

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });

  loadRenderer(settingsWindow, 'settings');
}

export function openSettingsWindow() {
  if (settingsWindow) {
    showSettingsWindow();
  } else {
    createSettingsWindow();
  }
}
