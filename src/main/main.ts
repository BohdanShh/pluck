import { app, globalShortcut } from 'electron';

import { registerPluckTextShortcut } from './shortcut';
import { createTray } from './tray';

app.on('ready', () => {
  createTray();
  registerPluckTextShortcut();
});

app.on('will-quit', () => globalShortcut.unregisterAll());
