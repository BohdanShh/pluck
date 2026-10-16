import { Tray } from 'electron';

import { openAboutPanel } from '../dialogs/about-panel';
import { pluckClipboardImage, pluckText } from '../pluck';
import { getSettings, onSettingsChange } from '../settings/store';
import { openSettingsWindow } from '../windows/settings-window';
import { buildMenu } from './menu';
import { createTrayIcon } from './tray-icon';

// Kept in a variable so the garbage collector doesn't remove the icon
let tray: Tray;

async function checkForUpdates() {
  const updater = await import('../updater');

  await updater.checkForUpdates();
}

function updateMenu() {
  tray.setContextMenu(
    buildMenu({
      shortcut: getSettings().pluckTextShortcut,
      onPluckText: pluckText,
      onPluckClipboardImage: pluckClipboardImage,
      onOpenSettings: openSettingsWindow,
      onOpenAbout: openAboutPanel,
      onCheckForUpdates: checkForUpdates,
    })
  );
}

export function createTray() {
  tray = new Tray(createTrayIcon());
  updateMenu();

  onSettingsChange((settings, previous) => {
    if (settings.pluckTextShortcut !== previous.pluckTextShortcut) updateMenu();
  });
}
