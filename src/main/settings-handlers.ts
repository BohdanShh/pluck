import { assertBoolean, assertString, handle } from './ipc';
import { getSettings, updateSettings } from './settings/store';
import { changeShortcut, pauseShortcut, resumeShortcut } from './shortcut';
import { isLaunchAtLoginEnabled, setLaunchAtLogin } from './system/launch-at-login';

export function setupSettingsHandlers() {
  handle('settings:get', () => ({
    ...getSettings(),
    launchAtLogin: isLaunchAtLoginEnabled(),
  }));

  handle('settings:set-keep-line-breaks', (_event, keep) => {
    assertBoolean(keep);
    updateSettings({ keepLineBreaks: keep });

    return getSettings().keepLineBreaks;
  });

  handle('settings:set-shortcut', (_event, accelerator) => {
    assertString(accelerator);

    return changeShortcut(accelerator);
  });

  handle('settings:pause-shortcut', event => pauseShortcut(event.sender));

  handle('settings:resume-shortcut', event => resumeShortcut(event.sender));

  handle('settings:set-launch-at-login', (_event, launch) => {
    assertBoolean(launch);

    return setLaunchAtLogin(launch);
  });
}
