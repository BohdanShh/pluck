import { use, useState, type ChangeEvent } from 'react';

import { SettingRow } from './components/setting-row';
import { ShortcutRecorder } from './components/shortcut-recorder';
import { Switch } from './components/switch';

const settingsPromise = window.settings.get();

export function Settings() {
  const initialSettings = use(settingsPromise);

  const [shortcut, setShortcut] = useState(initialSettings.pluckTextShortcut);
  const [shortcutError, setShortcutError] = useState<string | null>(null);
  const [keepLineBreaks, setKeepLineBreaks] = useState(initialSettings.keepLineBreaks);
  const [launchAtLogin, setLaunchAtLogin] = useState(initialSettings.launchAtLogin);

  const changeShortcut = async (accelerator: string) => {
    const error = await window.settings.setPluckTextShortcut(accelerator);

    setShortcutError(error);

    if (!error) setShortcut(accelerator);
  };

  const changeKeepLineBreaks = (event: ChangeEvent<HTMLInputElement>) => {
    const keep = event.target.checked;

    setKeepLineBreaks(keep);
    window.settings.setKeepLineBreaks(keep);
  };

  const changeLaunchAtLogin = async (event: ChangeEvent<HTMLInputElement>) => {
    const launch = event.target.checked;

    setLaunchAtLogin(launch);
    setLaunchAtLogin(await window.settings.setLaunchAtLogin(launch));
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
            onChange={changeKeepLineBreaks}
          />
        </SettingRow>
        <SettingRow
          as="label"
          title="Launch at Login"
          description="Start Pluck automatically when you log in"
        >
          <Switch
            checked={launchAtLogin}
            onChange={changeLaunchAtLogin}
          />
        </SettingRow>
      </div>
    </main>
  );
}
