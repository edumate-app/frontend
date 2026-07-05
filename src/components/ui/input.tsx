import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded-md border bg-surface px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50',
        error
          ? 'border-destructive focus-visible:shadow-none focus-visible:ring-2 focus-visible:ring-destructive/30'
          : 'border-input',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
