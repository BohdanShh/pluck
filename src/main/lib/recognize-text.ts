import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const RECOGNIZE_TEXT_PATH = path
  .join(import.meta.dirname, 'recognize-text')
  .replace('app.asar', 'app.asar.unpacked');

export async function recognizeText(imagePath: string) {
  try {
    const { stdout } = await execFileAsync(RECOGNIZE_TEXT_PATH, [imagePath]);

    return stdout.trim() || null;
  } catch (error) {
    console.error('Failed to recognize text:', error);

    return null;
  }
}
