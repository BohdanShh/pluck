import { rm } from 'node:fs/promises';

import { clipboard } from 'electron';

import { showNoClipboardImage } from './dialogs/clipboard-image-dialog';
import { confirmOpenScreenRecordingSettings } from './dialogs/screen-recording-dialog';
import { joinLines } from './lib/join-lines';
import { getSettings } from './settings/store';
import { captureScreen } from './system/capture-screen';
import { saveClipboardImage } from './system/clipboard-image';
import { playSound } from './system/play-sound';
import { recognizeText } from './system/recognize-text';
import { hasScreenRecordingAccess, openScreenRecordingSettings } from './system/screen-recording';

let isPlucking = false;

async function requestScreenRecordingAccess() {
  if (await confirmOpenScreenRecordingSettings()) await openScreenRecordingSettings();
}

async function withPluckGuard(pluck: () => Promise<void>) {
  if (isPlucking) return;

  isPlucking = true;

  try {
    await pluck();
  } finally {
    isPlucking = false;
  }
}

// Recognizes the image, deletes it and copies the result.
async function copyRecognizedText(imagePath: string) {
  const recognition = await recognizeText(imagePath);
  await rm(imagePath, { force: true });

  if (!recognition) {
    playSound('failure');
    return;
  }

  const { kind, text } = recognition;

  // Barcode payloads (vCards, Wi-Fi configs) are copied verbatim.
  await clipboard.writeText(
    kind === 'barcode' || getSettings().keepLineBreaks ? text : joinLines(text)
  );
  playSound('success');
}

export function pluckText() {
  return withPluckGuard(async () => {
    if (!hasScreenRecordingAccess()) {
      await requestScreenRecordingAccess();
      return;
    }

    const imagePath = await captureScreen();

    if (imagePath) await copyRecognizedText(imagePath);
  });
}

export function pluckClipboardImage() {
  return withPluckGuard(async () => {
    const imagePath = await saveClipboardImage();

    if (imagePath) await copyRecognizedText(imagePath);
    else await showNoClipboardImage();
  });
}
