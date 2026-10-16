import { autoUpdater, CancellationToken } from 'electron-updater';

import {
  confirmDownload,
  confirmRelaunch,
  showUpdateError,
  showUpToDate,
} from './dialogs/update-dialogs';
import { closeUpdateWindow, openUpdateWindow, sendUpdateProgress } from './windows/update-window';

autoUpdater.autoDownload = false;
autoUpdater.on('download-progress', sendUpdateProgress);

let isChecking = false;

async function downloadUpdate() {
  const cancellationToken = new CancellationToken();

  openUpdateWindow(() => cancellationToken.cancel());

  try {
    await autoUpdater.downloadUpdate(cancellationToken);

    return true;
  } catch (error) {
    if (cancellationToken.cancelled) return false;

    throw error;
  } finally {
    closeUpdateWindow();
  }
}

async function runUpdateCheck() {
  const result = await autoUpdater.checkForUpdates();

  if (!result?.isUpdateAvailable) {
    await showUpToDate();
    return;
  }

  if (!(await confirmDownload(result.updateInfo.version))) return;
  if (!(await downloadUpdate())) return;
  if (await confirmRelaunch()) autoUpdater.quitAndInstall();
}

export async function checkForUpdates() {
  if (isChecking) return;

  isChecking = true;

  try {
    await runUpdateCheck();
  } catch (error) {
    await showUpdateError(error);
  } finally {
    isChecking = false;
  }
}
