import { cva } from 'class-variance-authority';

export const counterVariants = cva(
  [
    'border-t',
    'border-transparent',
    'flex',
    'h-full',
    'inset-y-0',
    'items-center',
    'justify-center',
    'peer-disabled:opacity-50',
    'pointer-events-none',
    'tabular-nums',
    'text-muted-foreground',
    'text-xs',
  ],
  {
    variants: {
      isError: {
        true: ['text-destructive'],
      },
    },
  },
);
