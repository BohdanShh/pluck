import { globalShortcut } from 'electron';

import { PLUCK_TEXT_SHORTCUT } from './constants';
import { pluckText } from './tray';

export function registerPluckTextShortcut() {
  if (!globalShortcut.register(PLUCK_TEXT_SHORTCUT, pluckText)) {
    console.error(`Failed to register shortcut ${PLUCK_TEXT_SHORTCUT}`);
  }
}
