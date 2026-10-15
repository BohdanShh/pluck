export const IpcChannel = {
  getSettings: 'settings:get',
  setKeepLineBreaks: 'settings:set-keep-line-breaks',
  setShortcut: 'settings:set-shortcut',
  pauseShortcut: 'settings:pause-shortcut',
  resumeShortcut: 'settings:resume-shortcut',
  setLaunchAtLogin: 'settings:set-launch-at-login',
  updateProgress: 'updater:progress',
} as const;

export type RendererPage = 'settings' | 'update';
