import { app } from 'electron';

import { confirm, showMessage } from './show-message';

export async function showUpToDate() {
  await showMessage({
    message: 'You’re Up to Date',
    detail: `Pluck ${app.getVersion()} is the latest version.`,
  });
}

export function confirmDownload(version: string) {
  return confirm({
    message: 'A New Version of Pluck Is Available',
    detail: `Version ${version} is ready to download.`,
    confirmLabel: 'Download',
    cancelLabel: 'Not Now',
  });
}

export function confirmRelaunch() {
  return confirm({
    message: 'Download Complete',
    detail: 'It will be installed automatically when you quit Pluck.',
    confirmLabel: 'Relaunch',
    cancelLabel: 'Later',
  });
}

export async function showUpdateError(error: unknown) {
  await showMessage({
    type: 'error',
    message: 'Couldn’t Check for Updates',
    detail: error instanceof Error ? error.message : String(error),
  });
}
