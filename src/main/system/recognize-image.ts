import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

import { logError } from '../lib/log';

const execFileAsync = promisify(execFile);

const RECOGNIZE_IMAGE_PATH = path
  .join(import.meta.dirname, 'recognize-image')
  .replace('app.asar', 'app.asar.unpacked');

export type Recognition = {
  kind: 'text' | 'barcode';
  text: string;
};

function isRecognition(value: unknown): value is Recognition {
  if (typeof value !== 'object' || value === null) return false;

  const { kind, text } = value as Record<string, unknown>;

  return (kind === 'text' || kind === 'barcode') && typeof text === 'string';
}

export async function recognizeImage(imagePath: string): Promise<Recognition | null> {
  try {
    const { stdout } = await execFileAsync(RECOGNIZE_IMAGE_PATH, [imagePath]);
    const result: unknown = JSON.parse(stdout);

    if (!isRecognition(result)) throw new Error(`Unexpected output: ${stdout}`);

    const text = result.text.trim();

    return text ? { kind: result.kind, text } : null;
  } catch (error) {
    logError('Failed to recognize the image', error);

    return null;
  }
}
