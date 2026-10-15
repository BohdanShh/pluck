import { Menu, nativeImage } from 'electron';

type MenuOptions = {
  shortcut: string;
  onPluckText: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onCheckForUpdates: () => void;
};

export function buildMenu({
  shortcut,
  onPluckText,
  onOpenSettings,
  onOpenAbout,
  onCheckForUpdates,
}: MenuOptions) {
  return Menu.buildFromTemplate([
    { label: 'Pluck Text', accelerator: shortcut, click: onPluckText },
    { type: 'separator' },
    { label: 'Settings…', icon: nativeImage.createMenuSymbol('gearshape'), click: onOpenSettings },
    { label: 'About', icon: nativeImage.createMenuSymbol('info.circle'), click: onOpenAbout },
    {
      label: 'Check for Updates…',
      icon: nativeImage.createMenuSymbol('arrow.down.circle'),
      click: onCheckForUpdates,
    },
    { label: 'Quit Pluck', role: 'quit' },
  ]);
}
