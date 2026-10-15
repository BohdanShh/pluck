import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';

import { IpcChannel } from './shared/ipc';
import type { AppSettings } from './shared/settings';

const settings = {
  get: (): Promise<AppSettings> => ipcRenderer.invoke(IpcChannel.getSettings),
  setKeepLineBreaks: (keep: boolean): Promise<boolean> =>
    ipcRenderer.invoke(IpcChannel.setKeepLineBreaks, keep),
  setShortcut: (accelerator: string): Promise<string | null> =>
    ipcRenderer.invoke(IpcChannel.setShortcut, accelerator),
  pauseShortcut: (): Promise<void> => ipcRenderer.invoke(IpcChannel.pauseShortcut),
  resumeShortcut: (): Promise<void> => ipcRenderer.invoke(IpcChannel.resumeShortcut),
  setLaunchAtLogin: (launch: boolean): Promise<boolean> =>
    ipcRenderer.invoke(IpcChannel.setLaunchAtLogin, launch),
};

const updater = {
  onProgress: (callback: (percent: number) => void) => {
    const listener = (_event: IpcRendererEvent, percent: number) => callback(percent);

    ipcRenderer.on(IpcChannel.updateProgress, listener);

    return () => {
      ipcRenderer.off(IpcChannel.updateProgress, listener);
    };
  },
};

contextBridge.exposeInMainWorld('settings', settings);
contextBridge.exposeInMainWorld('updater', updater);

export type SettingsApi = typeof settings;
export type UpdaterApi = typeof updater;
