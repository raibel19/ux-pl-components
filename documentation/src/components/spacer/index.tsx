import { cn } from '../../lib/utils';

interface ISpacerProps {
  /**
   * Define la cantidad de espacio vertical.
   * 'sm' = 1rem (16px), 'md' = 2rem (32px), 'lg' = 4rem (64px), 'xl' = 6rem (96px)
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Clases de Tailwind adicionales si necesitas un tamaño muy específico (ej. 'h-5') */
  className?: string;
}

const sizeMap = {
  sm: 'h-4', // h-4 = 1rem = 16px
  md: 'h-8', // h-8 = 2rem = 32px
  lg: 'h-16', // h-16 = 4rem = 64px
  xl: 'h-24', // h-24 = 6rem = 96px
};

export default function Spacer(props: ISpacerProps) {
  const { className, size = 'sm' } = props;

  return <div className={cn(sizeMap[size], className)} />;
}
