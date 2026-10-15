import { app, dialog } from 'electron';
import { autoUpdater, CancellationToken } from 'electron-updater';

import { closeUpdateWindow, openUpdateWindow, sendUpdateProgress } from './windows/update-window';

autoUpdater.autoDownload = false;
autoUpdater.on('download-progress', sendUpdateProgress);

let isChecking = false;

async function showMessage(options: Electron.MessageBoxOptions) {
  app.focus({ steal: true });

  return dialog.showMessageBox(options);
}

async function installUpdate() {
  const cancellationToken = new CancellationToken();

  openUpdateWindow(() => cancellationToken.cancel());

  try {
    await autoUpdater.downloadUpdate(cancellationToken);
  } catch (error) {
    if (cancellationToken.cancelled) return;

    throw error;
  } finally {
    closeUpdateWindow();
  }

  const { response } = await showMessage({
    message: 'Download Complete',
    detail: 'It will be installed automatically when you quit Pluck.',
    buttons: ['Relaunch', 'Later'],
    defaultId: 0,
    cancelId: 1,
  });

  if (response === 0) autoUpdater.quitAndInstall();
}

async function runUpdateCheck() {
  const result = await autoUpdater.checkForUpdates();

  if (!result?.isUpdateAvailable) {
    await showMessage({
      message: 'You’re Up to Date',
      detail: `Pluck ${app.getVersion()} is the latest version.`,
    });
    return;
  }

  const { version } = result.updateInfo;
  const { response } = await showMessage({
    message: 'A New Version of Pluck Is Available',
    detail: `Version ${version} is ready to download.`,
    buttons: ['Download', 'Not Now'],
    defaultId: 0,
    cancelId: 1,
  });

  if (response === 0) await installUpdate();
}

export async function checkForUpdates() {
  if (isChecking) return;

  isChecking = true;

  try {
    await runUpdateCheck();
  } catch (error) {
    await showMessage({
      type: 'error',
      message: 'Couldn’t Check for Updates',
      detail: error instanceof Error ? error.message : String(error),
    });
  } finally {
    isChecking = false;
  }
}
