import { showMessage } from './show-message';

export function showNoClipboardImage() {
  return showMessage({
    message: 'No Image in the Clipboard',
    detail: 'Copy an image then try again.',
  });
}
