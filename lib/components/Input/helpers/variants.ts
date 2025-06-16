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
    'pe-[--rightWidth]',
    'text-foreground',
    'border-solid',
  ],
  {
    variants: {
      leftElement: {
        button: 'ps-9',
        icon: 'ps-9',
        text: 'ps-[--leftWidth]',
        clear: 'ps-[--leftWidth]',
        default: '',
      },
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
      leftElement: 'default',
      isError: false,
    },
  },
);

export const labelVariants = cva(
  [
    'absolute',
    'left-0',
    'top-0',
    'z-[1]',
    '-mt-2',
    'ml-2',
    'bg-background',
    'px-1.5',
    'text-xs',
    'text-foreground',
    'font-normal',
  ],
  {
    variants: {
      show: {
        false: 'hidden',
      },
      isError: {
        true: 'text-destructive',
      },
      gradient: {
        true: [
          'ml-1 inline-block px-4',
          '[-webkit-mask-image:linear-gradient(to_right,_transparent_0%,_black_9%,_black_90%,_transparent_100%)]',
          '[mask-image:linear-gradient(to_right,_transparent_0%,_black_9%,_black_90%,_transparent_100%)]',
          '[-webkit-mask-repeat:no-repeat]',
          '[mask-repeat:no-repeat]',
        ],
      },
    },
  },
);

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
          'focus:z-10',
          'hover:text-foreground',
          'outline-offset-2',
          'pointer-events-auto',
          'text-muted-foreground/80',
          'transition-colors',
          'bg-transparent',
        ],
      },
      show: {
        false: 'hidden',
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
      position: {
        left: 'start-0 rounded-s-md ps-2',
        right: 'end-0 me-2',
      },
      isLastElement: {
        true: 'rounded-e-md',
      },
    },
    compoundVariants: [
      { type: 'button', isError: true, class: 'hover:text-destructive/80' },
      { type: 'clear', isError: true, class: 'hover:text-destructive/80' },
    ],
  },
);

export const separatorVariants = cva(['mr-3', 'h-[15px]'], {
  variants: {
    isError: {
      true: ['bg-destructive'],
    },
  },
});

export const counterVariants = cva(
  [
    'border-t',
    'border-transparent',
    'end-0',
    'flex',
    'h-full',
    'inset-y-0',
    'items-center',
    'justify-center',
    'pe-2.5',
    'peer-disabled:opacity-50',
    'pointer-events-none',
    'tabular-nums',
    'text-muted-foreground',
    'text-xs',
  ],
  {
    variants: {
      show: {
        false: 'hidden',
      },
      isError: {
        true: ['text-destructive', 'rounded-none'],
      },
      isLastElement: {
        true: 'rounded-e-md',
      },
    },
  },
);
