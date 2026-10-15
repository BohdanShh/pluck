import path from 'node:path';

import type { BrowserWindow } from 'electron';

import type { RendererPage } from '../../shared/ipc';

export const PRELOAD_PATH = path.join(import.meta.dirname, 'preload.cjs');

export function loadRenderer(window: BrowserWindow, page: RendererPage) {
  if (process.env.VITE_DEV_SERVER_URL) {
    window.loadURL(`${process.env.VITE_DEV_SERVER_URL}src/renderer/index.html?page=${page}`);
  } else {
    window.loadFile(path.join(import.meta.dirname, '../dist/src/renderer/index.html'), {
      query: { page },
    });
  }
}
