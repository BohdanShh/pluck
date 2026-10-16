import { ipcMain, type IpcMainInvokeEvent, type WebContents } from 'electron';

import type {
  IpcEventChannel,
  IpcEventContract,
  IpcInvokeChannel,
  IpcInvokeContract,
} from '../shared/ipc';

type Handler<C extends IpcInvokeChannel> = (
  event: IpcMainInvokeEvent,
  ...args: unknown[]
) => IpcInvokeContract[C]['result'] | Promise<IpcInvokeContract[C]['result']>;

export function handle<C extends IpcInvokeChannel>(channel: C, handler: Handler<C>) {
  ipcMain.handle(channel, handler);
}

export function send<C extends IpcEventChannel>(
  webContents: WebContents,
  channel: C,
  ...args: IpcEventContract[C]
) {
  webContents.send(channel, ...args);
}

export function assertBoolean(value: unknown): asserts value is boolean {
  if (typeof value !== 'boolean') throw new TypeError('Expected a boolean');
}

export function assertString(value: unknown): asserts value is string {
  if (typeof value !== 'string') throw new TypeError('Expected a string');
}
