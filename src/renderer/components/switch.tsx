import type { ComponentProps } from 'react';

import { cn } from '../lib/cn';

export function Switch({ className, ...props }: Omit<ComponentProps<'input'>, 'type'>) {
  return (
    <span className={cn('relative h-5.5 w-9.5 shrink-0', className)}>
      <input
        type="checkbox"
        className="peer sr-only"
        {...props}
      />
      <span className="absolute inset-0 rounded-full bg-track transition-colors peer-checked:bg-accent" />
      <span className="absolute top-0.5 left-0.5 size-4.5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
    </span>
  );
}
