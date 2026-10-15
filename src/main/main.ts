import { app } from 'electron';

import { createTray } from './tray';

await app.whenReady();

createTray();
