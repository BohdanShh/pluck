import { app, globalShortcut } from 'electron';

import { setupAboutPanel } from './dialogs/about-panel';
import { setupSettingsHandlers } from './settings-handlers';
import { registerShortcut } from './shortcut';
import { createTray } from './tray/tray';

if (!app.requestSingleInstanceLock()) app.exit();

app.on('ready', () => {
  createTray();
  setupAboutPanel();
  setupSettingsHandlers();
  registerShortcut();
});

app.on('window-all-closed', () => {});

app.on('will-quit', () => globalShortcut.unregisterAll());
