import { execFile } from 'node:child_process';

import { logError } from '../lib/log';

const SOUNDS = {
  success:
    '/System/Library/Components/CoreAudio.component/Contents/SharedSupport/SystemSounds/system/Screen Capture.aif',
  failure: '/System/Library/Sounds/Basso.aiff',
};

export function playSound(sound: keyof typeof SOUNDS) {
  execFile('/usr/bin/afplay', [SOUNDS[sound]], error => {
    if (error) logError(`Failed to play the ${sound} sound`, error);
  });
}
