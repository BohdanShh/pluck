import { app, globalShortcut } from 'electron';

import { setupAbout } from './about';
import { registerPluckTextShortcut } from './shortcut';
import { createTray } from './tray';

app.on('ready', () => {
  setupAbout();
  createTray();
  registerPluckTextShortcut();
});

app.on('will-quit', () => globalShortcut.unregisterAll());
