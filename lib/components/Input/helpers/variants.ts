import { cva } from 'class-variance-authority';

export const inputVariants = cva(
  [
    'w-full',
    'placeholder:text-gray-400',
    'focus-visible:ring-1',
    'focus-visible:ring-slate-300',
    'focus-visible:ring-offset-0',
    'pe-[--rightWidth]',
    'text-foreground',
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
    'bg-primary-foreground',
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
          'focus-visible:outline-2',
          'focus-visible:outline-ring/70',
          'focus-visible:outline',
          'hover:text-foreground',
          'outline-offset-2',
          'pointer-events-auto',
          'text-muted-foreground/80',
          'transition-colors',
        ],
        icon: ['peer-disabled:opacity-50', 'pointer-events-none', 'text-muted-foreground/80'],
        text: ['peer-disabled:opacity-50', 'pointer-events-none', 'text-muted-foreground', 'text-sm'],
        clear: [
          'disabled:cursor-not-allowed',
          'disabled:opacity-50',
          'disabled:pointer-events-none',
          'focus-visible:outline-2',
          'focus-visible:outline-ring/70',
          'focus-visible:outline',
          'focus:z-10',
          'hover:text-foreground',
          'outline-offset-2',
          'pointer-events-auto',
          'text-muted-foreground/80',
          'transition-colors',
        ],
      },
      show: {
        false: 'hidden',
      },
      isError: {
        true: ['text-destructive', 'hover:text-destructive'],
      },
      disable: {
        true: 'pointer-events-none',
      },
      position: {
        left: 'start-0 rounded-s-md ps-3',
        right: 'end-0 pe-3',
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
