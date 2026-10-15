import { app, ipcMain } from 'electron';

import {
  changePluckTextShortcut,
  registerPluckTextShortcut,
  unregisterPluckTextShortcut,
} from '../shortcut';
import { getSettings, updateSettings, type AppSettings } from './store';

export function setupSettingsHandlers() {
  ipcMain.handle('settings:get', (): AppSettings => ({
    ...getSettings(),
    launchAtLogin: app.getLoginItemSettings().openAtLogin,
  }));

  ipcMain.handle('settings:set-keep-line-breaks', (_event, keep: boolean) => {
    updateSettings({ keepLineBreaks: keep });
  });

  ipcMain.handle('settings:set-pluck-text-shortcut', (_event, accelerator: string) =>
    changePluckTextShortcut(accelerator)
  );

  ipcMain.handle('settings:pause-pluck-text-shortcut', event => {
    unregisterPluckTextShortcut();
    event.sender.once('destroyed', registerPluckTextShortcut);
  });

  ipcMain.handle('settings:resume-pluck-text-shortcut', event => {
    event.sender.off('destroyed', registerPluckTextShortcut);
    registerPluckTextShortcut();
  });

  ipcMain.handle('settings:set-launch-at-login', (_event, launch: boolean) => {
    app.setLoginItemSettings({ openAtLogin: launch });

    return app.getLoginItemSettings().openAtLogin;
  });
}
