import { confirm } from './show-message';

export function confirmOpenScreenRecordingSettings() {
  return confirm({
    message: 'Pluck Needs Screen Recording Access',
    detail:
      'Allow Pluck in System Settings → Privacy & Security → Screen & System Audio Recording, then reopen Pluck.',
    confirmLabel: 'Open System Settings',
  });
}
