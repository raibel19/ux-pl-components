import { useState } from 'react';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  variant?: 'default' | 'info' | 'warning' | 'success' | 'error' | 'premium';
  collapsible?: boolean;
  defaultExpanded?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  icon?: React.ReactNode;
  badge?: string;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  variant = 'default',
  collapsible = false,
  defaultExpanded = true,
  showHeader = true,
  showFooter = true,
  icon,
  badge,
  className = '',
  onClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const variants = {
    default: {
      container: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 border-l-blue-500',
      header: 'bg-gray-50 dark:bg-gray-700',
      shadow: 'shadow-lg hover:shadow-xl',
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 border-l-blue-500',
      header: 'bg-blue-100 dark:bg-blue-800/30',
      shadow: 'shadow-lg shadow-blue-100/50 hover:shadow-xl hover:shadow-blue-200/50',
    },
    warning: {
      container: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 border-l-amber-500',
      header: 'bg-amber-100 dark:bg-amber-800/30',
      shadow: 'shadow-lg shadow-amber-100/50 hover:shadow-xl hover:shadow-amber-200/50',
    },
    success: {
      container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 border-l-green-500',
      header: 'bg-green-100 dark:bg-green-800/30',
      shadow: 'shadow-lg shadow-green-100/50 hover:shadow-xl hover:shadow-green-200/50',
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 border-l-red-500',
      header: 'bg-red-100 dark:bg-red-800/30',
      shadow: 'shadow-lg shadow-red-100/50 hover:shadow-xl hover:shadow-red-200/50',
    },
    premium: {
      container:
        'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 border-l-purple-500',
      header: 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800/30 dark:to-pink-800/30',
      shadow: 'shadow-lg shadow-purple-100/50 hover:shadow-xl hover:shadow-purple-200/50',
    },
  };

  const currentVariant = variants[variant];

  const getDefaultIcon = () => {
    const iconClass = 'w-5 h-5';
    switch (variant) {
      case 'info':
        return <InfoIcon className={`${iconClass} text-blue-600 dark:text-blue-400`} />;
      case 'warning':
        return <WarningIcon className={`${iconClass} text-amber-600 dark:text-amber-400`} />;
      case 'success':
        return <CheckIcon className={`${iconClass} text-green-600 dark:text-green-400`} />;
      case 'error':
        return <ErrorIcon className={`${iconClass} text-red-600 dark:text-red-400`} />;
      case 'premium':
        return <StarIcon className={`${iconClass} text-purple-600 dark:text-purple-400`} />;
      default:
        return null;
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
    // Eliminamos la funcionalidad de expandir/contraer al hacer clic en toda la card
  };

  return (
    <div
      className={cn(
        'relative rounded-lg border border-l-4 transition-all duration-300 ease-in-out',
        currentVariant.container,
        currentVariant.shadow,
        onclick && 'cursor-pointer',
        className,
      )}
      // className={`relative rounded-lg border border-l-4 transition-all duration-300 ease-in-out ${currentVariant.container} ${currentVariant.shadow} ${onClick ? 'cursor-pointer' : ''} ${className} `}
      onClick={handleCardClick}
      style={{
        // Eliminamos cualquier espacio adicional cuando está contraído
        overflow: 'hidden',
      }}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -right-2 -top-2 z-10">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-100">
            {badge}
          </span>
        </div>
      )}

      {/* Header */}
      {showHeader && (title || subtitle || collapsible) && (
        <div
          className={`px-6 py-4 ${isExpanded ? 'border-b border-gray-200 dark:border-gray-600' : ''} ${currentVariant.header} ${!isExpanded && !showFooter ? 'rounded-lg' : 'rounded-t-lg'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {(icon || getDefaultIcon()) && <div className="flex-shrink-0">{icon || getDefaultIcon()}</div>}
              <div className="min-w-0 flex-1">
                {title && <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>}
                {subtitle && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
              </div>
            </div>

            {collapsible && (
              <button
                onClick={handleToggle}
                className="ml-4 flex-shrink-0 rounded-full p-1 transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                aria-label={isExpanded ? 'Contraer' : 'Expandir'}
              >
                <ChevronIcon
                  className={`h-5 w-5 text-gray-600 transition-transform duration-200 dark:text-gray-400 ${
                    isExpanded ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content - Ahora con height: 0 cuando está contraído */}
      {isExpanded && <div className="px-6 py-4">{children}</div>}

      {/* Footer */}
      {showFooter && footer && isExpanded && (
        <div className="rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-600 dark:bg-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
};

// Iconos simples usando SVG
const InfoIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const WarningIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
);

const CheckIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ErrorIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const StarIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const ChevronIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export default Card;
