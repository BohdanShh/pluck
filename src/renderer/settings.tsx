import { use, useState } from 'react';

import { SettingRow } from './components/setting-row';
import { ShortcutRecorder } from './components/shortcut-recorder';
import { Switch } from './components/switch';
import { useSyncedSetting } from './hooks/use-synced-setting';

const settingsPromise = window.settings.get();

export function Settings() {
  const initialSettings = use(settingsPromise);

  const [shortcut, setShortcut] = useState(initialSettings.pluckTextShortcut);
  const [shortcutError, setShortcutError] = useState<string | null>(null);
  const [keepLineBreaks, changeKeepLineBreaks] = useSyncedSetting(
    initialSettings.keepLineBreaks,
    window.settings.setKeepLineBreaks
  );
  const [launchAtLogin, changeLaunchAtLogin] = useSyncedSetting(
    initialSettings.launchAtLogin,
    window.settings.setLaunchAtLogin
  );

  const changeShortcut = async (accelerator: string) => {
    const error = await window.settings.setShortcut(accelerator);

    setShortcutError(error);

    if (!error) setShortcut(accelerator);
  };

  return (
    <main className="p-4">
      <div className="divide-y divide-border rounded-[10px] border border-border bg-card px-3">
        <SettingRow
          title="Shortcut"
          description="Press to copy text from your screen"
          error={shortcutError}
        >
          <ShortcutRecorder
            value={shortcut}
            onChange={changeShortcut}
          />
        </SettingRow>
        <SettingRow
          as="label"
          title="Keep Line Breaks"
          description="Copy text line by line instead of joining it"
        >
          <Switch
            checked={keepLineBreaks}
            onChange={event => changeKeepLineBreaks(event.target.checked)}
          />
        </SettingRow>
        <SettingRow
          as="label"
          title="Launch at Login"
          description="Start Pluck automatically when you log in"
        >
          <Switch
            checked={launchAtLogin}
            onChange={event => changeLaunchAtLogin(event.target.checked)}
          />
        </SettingRow>
      </div>
    </main>
  );
}
