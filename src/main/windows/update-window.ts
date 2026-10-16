import { app, BrowserWindow } from 'electron';
import type { ProgressInfo } from 'electron-updater';

import { send } from '../ipc';
import { loadRenderer, PRELOAD_PATH } from './load-renderer';

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
      preload: PRELOAD_PATH,
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

  loadRenderer(updateWindow, 'update');
}

export function sendUpdateProgress({ percent }: ProgressInfo) {
  if (updateWindow) send(updateWindow.webContents, 'updater:progress', Math.floor(percent));
}

export function closeUpdateWindow() {
  updateWindow?.destroy();
}
