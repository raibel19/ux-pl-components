import { cva } from 'class-variance-authority';

export const separatorVariants = cva('pointer-events-none mx-2 h-[15px]', {
  variants: {
    isInvalid: {
      true: 'bg-destructive',
    },
    disabled: {
      true: 'opacity-50',
    },
  },
});
