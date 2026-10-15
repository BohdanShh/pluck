import { app, desktopCapturer, dialog, shell, systemPreferences } from 'electron';

const PRIVACY_SETTINGS_URL =
  'x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture';

export function hasScreenRecordingAccess() {
  return systemPreferences.getMediaAccessStatus('screen') === 'granted';
}

async function registerInPrivacySettings() {
  try {
    await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 0, height: 0 } });
  } catch (error) {
    console.error('Failed to request screen recording access:', error);
  }
}

export async function requestScreenRecordingAccess() {
  app.focus({ steal: true });

  const { response } = await dialog.showMessageBox({
    message: 'Pluck Needs Screen Recording Access',
    detail:
      'Allow Pluck in System Settings → Privacy & Security → Screen & System Audio Recording, then reopen Pluck.',
    buttons: ['Open System Settings', 'Cancel'],
    defaultId: 0,
    cancelId: 1,
  });

  if (response !== 0) return;

  await registerInPrivacySettings();
  await shell.openExternal(PRIVACY_SETTINGS_URL);
}
