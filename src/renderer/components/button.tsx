import type { ComponentProps } from 'react';

import { cn } from '../lib/cn';

export function Button({ className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'h-6.5 shrink-0 cursor-pointer rounded-md bg-field px-2.5 font-medium whitespace-nowrap outline-none hover:bg-field-hover',
        className
      )}
      {...props}
    />
  );
}
