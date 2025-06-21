import { cva } from 'class-variance-authority';

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
