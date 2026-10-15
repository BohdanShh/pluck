import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export async function captureScreen() {
  const imagePath = path.join(tmpdir(), `pluck-${Date.now()}.png`);

  try {
    await execFileAsync('/usr/sbin/screencapture', ['-i', '-x', imagePath]);

    return existsSync(imagePath) ? imagePath : null;
  } catch {
    return null;
  }
}
