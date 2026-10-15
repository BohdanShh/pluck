import type { ReactNode } from 'react';

import { cn } from '../lib/cn';

type SettingRowProps = {
  title: string;
  description: string;
  error?: string | null;
  as?: 'div' | 'label';
  children: ReactNode;
};

export function SettingRow({
  title,
  description,
  error,
  as: Component = 'div',
  children,
}: SettingRowProps) {
  return (
    <Component
      className={cn('flex items-center justify-between gap-4 py-2.5', {
        'cursor-pointer': Component === 'label',
      })}
    >
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{title}</span>
        <span className={cn('text-[11px] text-muted', { 'text-destructive': error })}>
          {error ?? description}
        </span>
      </div>
      {children}
    </Component>
  );
}
