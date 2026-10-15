import { useState, type KeyboardEvent } from 'react';

import { cn } from '../lib/cn';
import { Button } from './button';
import { formatShortcut, toAccelerator } from '../lib/shortcut';

type ShortcutRecorderProps = {
  value: string;
  onChange: (accelerator: string) => Promise<void>;
};

export function ShortcutRecorder({ value, onChange }: ShortcutRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    if (isRecording) return;

    setIsRecording(true);
    window.settings.pauseShortcut();
  };

  const stopRecording = () => {
    if (!isRecording) return;

    setIsRecording(false);
    window.settings.resumeShortcut();
  };

  const recordShortcut = async (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!isRecording) return;

    event.preventDefault();

    if (event.code === 'Escape') {
      stopRecording();
      return;
    }

    const accelerator = toAccelerator(event);

    if (!accelerator) return;

    setIsRecording(false);
    await onChange(accelerator);
    window.settings.resumeShortcut();
  };

  return (
    <Button
      onClick={startRecording}
      onKeyDown={recordShortcut}
      onBlur={stopRecording}
      className={cn('w-29 tracking-[0.08em]', {
        'tracking-normal text-muted ring-2 ring-accent': isRecording,
      })}
    >
      {isRecording ? 'Press Keys…' : formatShortcut(value)}
    </Button>
  );
}
