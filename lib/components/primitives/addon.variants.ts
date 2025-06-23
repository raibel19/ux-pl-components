import { cva } from 'class-variance-authority';

export const elementsVariants = cva(
  ['border-t', 'border-transparent', 'flex', 'h-full', 'inset-y-0', 'items-center', 'justify-center'],
  {
    variants: {
      type: {
        button: [
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
        icon: ['text-muted-foreground hover:text-foreground'],
        text: ['text-muted-foreground', 'text-sm'],
        clear: [
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
      isDisabled: {
        true: 'pointer-events-none cursor-not-allowed opacity-50',
      },
    },
    compoundVariants: [
      { type: 'button', isError: true, class: 'hover:text-destructive/80' },
      { type: 'clear', isError: true, class: 'hover:text-destructive/80' },
      { type: 'icon', isError: true, class: 'hover:text-destructive/80' },
    ],
  },
);
