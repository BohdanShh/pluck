import { nativeImage } from 'electron';

import trayIconUrl from '../assets/trayTemplate.png?inline';
import trayIconUrl2x from '../assets/trayTemplate@2x.png?inline';

export function createTrayIcon() {
  const icon = nativeImage.createFromDataURL(trayIconUrl);

  icon.addRepresentation({ scaleFactor: 2, dataURL: trayIconUrl2x });
  icon.setTemplateImage(true);

  return icon;
}
