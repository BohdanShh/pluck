import { app } from 'electron';

export function isLaunchAtLoginEnabled() {
  return app.getLoginItemSettings().openAtLogin;
}

export function setLaunchAtLogin(enabled: boolean) {
  app.setLoginItemSettings({ openAtLogin: enabled });

  return isLaunchAtLoginEnabled();
}
