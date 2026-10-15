import { rm } from 'node:fs/promises';

import { clipboard } from 'electron';

import { captureScreen } from './lib/capture-screen';
import { joinLines } from './lib/join-lines';
import { playSound } from './lib/play-sound';
import { recognizeText } from './lib/recognize-text';
import {
  hasScreenRecordingAccess,
  requestScreenRecordingAccess,
} from './lib/screen-recording-access';
import { getSettings } from './settings/store';

let isPlucking = false;

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

    const text = await recognizeText(imagePath);
    await rm(imagePath, { force: true });

    if (!text) {
      playSound('failure');
      return;
    }

    clipboard.writeText(getSettings().keepLineBreaks ? text : joinLines(text));
    playSound('success');
  } finally {
    isPlucking = false;
  }
}
