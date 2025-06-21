import { cva } from 'class-variance-authority';

export const elementsVariants = cva(
  ['border-t', 'border-transparent', 'flex', 'h-full', 'inset-y-0', 'items-center', 'justify-center'],
  {
    variants: {
      type: {
        button: [
          'disabled:cursor-not-allowed',
          'disabled:opacity-50',
          'disabled:pointer-events-none',
          'focus-visible:outline-none',
          'focus-visible:ring-1',
          'focus-visible:ring-ring',
          'focus-visible:ring-offset-0',
          'focus-visible:ring-offset-background',
          'hover:text-foreground',
          'outline-offset-2',
          'pointer-events-auto',
          'text-muted-foreground/80',
          'transition-colors',
          'bg-transparent',
        ],
        icon: ['peer-disabled:opacity-50', 'pointer-events-none', 'text-muted-foreground/80'],
        text: ['peer-disabled:opacity-50', 'pointer-events-none', 'text-muted-foreground', 'text-sm'],
        clear: [
          'disabled:cursor-not-allowed',
          'disabled:opacity-50',
          'disabled:pointer-events-none',
          'focus-visible:outline-none',
          'focus-visible:ring-1',
          'focus-visible:ring-ring',
          'focus-visible:ring-offset-0',
          'focus-visible:ring-offset-background',
          'hover:text-foreground',
          'outline-offset-2',
          'pointer-events-auto',
          'text-muted-foreground/80',
          'transition-colors',
          'bg-transparent',
        ],
      },
      isError: {
        true: [
          'text-destructive',
          'hover:text-destructive',
          'focus-visible:ring-destructive focus-visible:ring-offset-destructive',
        ],
      },
      disable: {
        true: 'pointer-events-none',
      },
    },
    compoundVariants: [
      { type: 'button', isError: true, class: 'hover:text-destructive/80' },
      { type: 'clear', isError: true, class: 'hover:text-destructive/80' },
    ],
  },
);
