import { ReactNode } from 'react';

import { cn } from '../../lib/utils';

interface InputContentProps {
  children: ReactNode;
  className?: string;
}

export default function InputContent(props: InputContentProps) {
  const { children, className } = props;

  return <div className={cn('relative w-full', className)}>{children}</div>;
}
