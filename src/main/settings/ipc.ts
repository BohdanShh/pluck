import { app, ipcMain } from 'electron';

import { IpcChannel } from '../../shared/ipc';
import type { AppSettings } from '../../shared/settings';
import { changeShortcut, pauseShortcut, resumeShortcut } from '../shortcut';
import { getSettings, updateSettings } from './store';

function assertBoolean(value: unknown): asserts value is boolean {
  if (typeof value !== 'boolean') throw new TypeError('Expected a boolean');
}

function assertString(value: unknown): asserts value is string {
  if (typeof value !== 'string') throw new TypeError('Expected a string');
}

export function setupSettingsHandlers() {
  ipcMain.handle(IpcChannel.getSettings, (): AppSettings => ({
    ...getSettings(),
    launchAtLogin: app.getLoginItemSettings().openAtLogin,
  }));

  ipcMain.handle(IpcChannel.setKeepLineBreaks, (_event, keep: unknown) => {
    assertBoolean(keep);
    updateSettings({ keepLineBreaks: keep });

    return getSettings().keepLineBreaks;
  });

  ipcMain.handle(IpcChannel.setShortcut, (_event, accelerator: unknown) => {
    assertString(accelerator);

    return changeShortcut(accelerator);
  });

  ipcMain.handle(IpcChannel.pauseShortcut, event => pauseShortcut(event.sender));

  ipcMain.handle(IpcChannel.resumeShortcut, event => resumeShortcut(event.sender));

  ipcMain.handle(IpcChannel.setLaunchAtLogin, (_event, launch: unknown) => {
    assertBoolean(launch);
    app.setLoginItemSettings({ openAtLogin: launch });

    return app.getLoginItemSettings().openAtLogin;
  });
}
