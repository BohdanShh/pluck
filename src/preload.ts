import { contextBridge, ipcRenderer } from 'electron';

import type { AppSettings } from './main/settings/store';

const settings = {
  get: (): Promise<AppSettings> => ipcRenderer.invoke('settings:get'),
  setKeepLineBreaks: (keep: boolean): Promise<void> =>
    ipcRenderer.invoke('settings:set-keep-line-breaks', keep),
  setPluckTextShortcut: (accelerator: string): Promise<string | null> =>
    ipcRenderer.invoke('settings:set-pluck-text-shortcut', accelerator),
  pausePluckTextShortcut: (): Promise<void> =>
    ipcRenderer.invoke('settings:pause-pluck-text-shortcut'),
  resumePluckTextShortcut: (): Promise<void> =>
    ipcRenderer.invoke('settings:resume-pluck-text-shortcut'),
  setLaunchAtLogin: (launch: boolean): Promise<boolean> =>
    ipcRenderer.invoke('settings:set-launch-at-login', launch),
};

contextBridge.exposeInMainWorld('settings', settings);

export type SettingsApi = typeof settings;
