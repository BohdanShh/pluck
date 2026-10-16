import fs from 'node:fs';
import path from 'node:path';

import { app } from 'electron';

function filePath(name: string) {
  return path.join(app.getPath('userData'), name);
}

export function readJsonFile(name: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(filePath(name), 'utf8'));
  } catch {
    return null;
  }
}

export function writeJsonFile(name: string, data: unknown) {
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2));
}
