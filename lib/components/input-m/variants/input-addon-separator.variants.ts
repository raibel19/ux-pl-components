import { cva } from 'class-variance-authority';

export const separatorVariants = cva(['mx-2', 'h-[15px]'], {
  variants: {
    isError: {
      true: ['bg-destructive'],
    },
  },
});
