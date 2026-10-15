import { execFile } from 'node:child_process';

const SOUNDS = {
  success:
    '/System/Library/Components/CoreAudio.component/Contents/SharedSupport/SystemSounds/system/Screen Capture.aif',
  failure: '/System/Library/Sounds/Basso.aiff',
};

export function playSound(sound: keyof typeof SOUNDS) {
  execFile('/usr/bin/afplay', [SOUNDS[sound]], () => {});
}
