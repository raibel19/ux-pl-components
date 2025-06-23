import { cva } from 'class-variance-authority';

export const messageVariants = cva('list-inside list-none space-y-1', {
  variants: {
    type: {
      default: 'text-muted-foreground',
      error: 'text-destructive',
      warning: 'text-ux-warning',
      info: 'text-ux-info',
      success: 'text-success',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    type: 'info',
    size: 'md',
  },
});
