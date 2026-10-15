import path from 'node:path';

import { app, BrowserWindow } from 'electron';
import type { ProgressInfo } from 'electron-updater';

let updateWindow: BrowserWindow | null = null;

export function openUpdateWindow(onCancel: () => void) {
  updateWindow = new BrowserWindow({
    width: 360,
    height: 126,
    useContentSize: true,
    show: false,
    title: '',
    titleBarStyle: 'hidden',
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    vibrancy: 'window',
    webPreferences: {
      preload: path.join(import.meta.dirname, 'preload.cjs'),
    },
  });

  updateWindow.once('ready-to-show', () => {
    updateWindow?.show();
    app.focus({ steal: true });
  });

  updateWindow.on('page-title-updated', event => event.preventDefault());

  updateWindow.on('close', onCancel);

  updateWindow.on('closed', () => {
    updateWindow = null;
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    updateWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}src/renderer/index.html?window=update`);
  } else {
    updateWindow.loadFile(path.join(import.meta.dirname, '../dist/src/renderer/index.html'), {
      query: { window: 'update' },
    });
  }
}

export function sendUpdateProgress({ percent }: ProgressInfo) {
  updateWindow?.webContents.send('updater:progress', Math.floor(percent));
}

export function closeUpdateWindow() {
  updateWindow?.destroy();
}
