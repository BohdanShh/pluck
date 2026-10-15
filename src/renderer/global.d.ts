import type { SettingsApi } from '../preload';

declare global {
  interface Window {
    settings: SettingsApi;
  }
}
