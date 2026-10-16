import type { AppSettings } from './settings';

export type IpcInvokeContract = {
  'settings:get': { args: []; result: AppSettings };
  'settings:set-keep-line-breaks': { args: [keep: boolean]; result: boolean };
  'settings:set-shortcut': { args: [accelerator: string]; result: string | null };
  'settings:pause-shortcut': { args: []; result: void };
  'settings:resume-shortcut': { args: []; result: void };
  'settings:set-launch-at-login': { args: [launch: boolean]; result: boolean };
};

export type IpcEventContract = {
  'updater:progress': [percent: number];
};

export type IpcInvokeChannel = keyof IpcInvokeContract;
export type IpcEventChannel = keyof IpcEventContract;

export type RendererPage = 'settings' | 'update';
