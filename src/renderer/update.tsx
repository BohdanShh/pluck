import { useEffect, useState } from 'react';

import { Button } from './components/button';

export function Update() {
  const [percent, setPercent] = useState(0);

  useEffect(() => window.updater.onProgress(setPercent), []);

  return (
    <main className="flex flex-col gap-2.5 px-4 pt-11 pb-4 [-webkit-app-region:drag]">
      <span className="font-medium">Downloading update…</span>
      <div className="h-1.5 overflow-hidden rounded-full bg-track">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-200"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted tabular-nums">{percent}%</span>
        <Button
          onClick={() => window.close()}
          className="px-3 [-webkit-app-region:no-drag]"
        >
          Cancel
        </Button>
      </div>
    </main>
  );
}
