import { desktopCapturer, shell, systemPreferences } from 'electron';

import { logError } from '../lib/log';

const PRIVACY_SETTINGS_URL =
  'x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture';

export function hasScreenRecordingAccess() {
  return systemPreferences.getMediaAccessStatus('screen') === 'granted';
}

export async function openScreenRecordingSettings() {
  try {
    await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 0, height: 0 } });
  } catch (error) {
    logError('Failed to request screen recording access', error);
  }

  await shell.openExternal(PRIVACY_SETTINGS_URL);
}
