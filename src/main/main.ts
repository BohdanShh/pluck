import path from 'node:path';

import { app, BrowserWindow } from 'electron';

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    title: 'Pluck',
    webPreferences: {
      preload: path.join(import.meta.dirname, 'preload.cjs'),
    },
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}src/renderer/index.html`);
  } else {
    mainWindow.loadFile(path.join(import.meta.dirname, '../dist/src/renderer/index.html'));
  }
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});
