import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';

import type {
  IpcEventChannel,
  IpcEventContract,
  IpcInvokeChannel,
  IpcInvokeContract,
} from './shared/ipc';

function invoke<C extends IpcInvokeChannel>(
  channel: C,
  ...args: IpcInvokeContract[C]['args']
): Promise<IpcInvokeContract[C]['result']> {
  return ipcRenderer.invoke(channel, ...args);
}

function on<C extends IpcEventChannel>(
  channel: C,
  listener: (...args: IpcEventContract[C]) => void
) {
  const wrapped = (_event: IpcRendererEvent, ...args: unknown[]) =>
    listener(...(args as IpcEventContract[C]));

  ipcRenderer.on(channel, wrapped);

  return () => {
    ipcRenderer.off(channel, wrapped);
  };
}

const settings = {
  get: () => invoke('settings:get'),
  setKeepLineBreaks: (keep: boolean) => invoke('settings:set-keep-line-breaks', keep),
  setShortcut: (accelerator: string) => invoke('settings:set-shortcut', accelerator),
  pauseShortcut: () => invoke('settings:pause-shortcut'),
  resumeShortcut: () => invoke('settings:resume-shortcut'),
  setLaunchAtLogin: (launch: boolean) => invoke('settings:set-launch-at-login', launch),
};

const updater = {
  onProgress: (callback: (percent: number) => void) => on('updater:progress', callback),
};

contextBridge.exposeInMainWorld('settings', settings);
contextBridge.exposeInMainWorld('updater', updater);

export type SettingsApi = typeof settings;
export type UpdaterApi = typeof updater;
