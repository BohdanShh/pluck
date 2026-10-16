import { rm } from 'node:fs/promises';

import { clipboard } from 'electron';

import { confirmOpenScreenRecordingSettings } from './dialogs/screen-recording-dialog';
import { joinLines } from './lib/join-lines';
import { getSettings } from './settings/store';
import { captureScreen } from './system/capture-screen';
import { playSound } from './system/play-sound';
import { recognizeText } from './system/recognize-text';
import { hasScreenRecordingAccess, openScreenRecordingSettings } from './system/screen-recording';

let isPlucking = false;

async function requestScreenRecordingAccess() {
  if (await confirmOpenScreenRecordingSettings()) await openScreenRecordingSettings();
}

export async function pluckText() {
  if (isPlucking) return;

  isPlucking = true;

  try {
    if (!hasScreenRecordingAccess()) {
      await requestScreenRecordingAccess();
      return;
    }

    const imagePath = await captureScreen();

    if (!imagePath) return;

    const recognition = await recognizeText(imagePath);
    await rm(imagePath, { force: true });

    if (!recognition) {
      playSound('failure');
      return;
    }

    const { kind, text } = recognition;

    // Barcode payloads (vCards, Wi-Fi configs) are copied verbatim.
    clipboard.writeText(
      kind === 'barcode' || getSettings().keepLineBreaks ? text : joinLines(text)
    );
    playSound('success');
  } finally {
    isPlucking = false;
  }
}
