import { cva } from 'class-variance-authority';

export const inputVariants = cva(
  [
    'w-full',
    'placeholder:text-ux-placeholder',
    'focus-visible:outline-none',
    'focus-visible:ring-1',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-0',
    'focus-visible:ring-offset-background',
    'text-foreground',
    'border-solid',
  ],
  {
    variants: {
      isError: {
        true: [
          'border-destructive/80',
          // 'text-destructive',
          'focus-visible:border-destructive/80',
          'focus-visible:ring-destructive/20',
        ],
      },
    },
    defaultVariants: {
      isError: false,
    },
  },
);
