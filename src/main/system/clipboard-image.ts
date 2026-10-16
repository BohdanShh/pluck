import { copyFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { clipboard } from 'electron';

import { logError } from '../lib/log';

const IMAGE_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.heic',
  '.heif',
  '.tif',
  '.tiff',
  '.gif',
  '.bmp',
  '.webp',
]);

function tempImagePath(extension: string) {
  return path.join(tmpdir(), `pluck-${Date.now()}${extension}`);
}

async function saveImageFile(item: Electron.ClipboardItem) {
  const uriList = await (await item.getType('text/uri-list')).text();
  const fileUrl = uriList.split(/\r?\n/).find(line => line.startsWith('file://'));

  if (!fileUrl) return null;

  const filePath = fileURLToPath(fileUrl);
  const extension = path.extname(filePath).toLowerCase();

  if (!IMAGE_EXTENSIONS.has(extension)) return null;

  const imagePath = tempImagePath(extension);
  await copyFile(filePath, imagePath);

  return imagePath;
}

async function saveImage(item: Electron.ClipboardItem) {
  const image = await item.getType('image/png');
  const imagePath = tempImagePath('.png');
  await writeFile(imagePath, Buffer.from(await image.arrayBuffer()));

  return imagePath;
}

// Saves the clipboard image to a temp file the caller deletes.
export async function saveClipboardImage() {
  try {
    const [item] = await clipboard.read();

    if (!item) return null;

    // A file copied in Finder also carries its icon, so the file wins over the image.
    if (item.types.includes('text/uri-list')) return await saveImageFile(item);
    if (item.types.includes('image/png')) return await saveImage(item);

    return null;
  } catch (error) {
    logError('Failed to read the clipboard image', error);

    return null;
  }
}
