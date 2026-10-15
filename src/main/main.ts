import { app, globalShortcut } from 'electron';

import { setupSettingsHandlers } from './settings/ipc';
import { registerPluckTextShortcut } from './shortcut';
import { createTray } from './tray/tray';
import { setupAboutWindow } from './windows/about-window';

if (!app.requestSingleInstanceLock()) app.exit();

app.on('ready', () => {
  createTray();
  setupAboutWindow();
  setupSettingsHandlers();
  registerPluckTextShortcut();
});

app.on('window-all-closed', () => {});

app.on('will-quit', () => globalShortcut.unregisterAll());
