import clsx from 'clsx';

interface BadgeProps {
  text: string;
  type?: 'success' | 'warning' | 'info' | 'danger' | 'neutral';
}

export default function Badges({ text, type = 'neutral' }: BadgeProps): JSX.Element {
  const baseClasses = 'px-2 py-0.5 rounded-full text-xs font-semibold';
  const typeClasses = {
    success: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    danger: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };

  return <span className={clsx(baseClasses, typeClasses[type])}>{text}</span>;
}
