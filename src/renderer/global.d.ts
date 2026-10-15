import type { SettingsApi, UpdaterApi } from '../preload';

declare global {
  interface Window {
    settings: SettingsApi;
    updater: UpdaterApi;
  }
}
