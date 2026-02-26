import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Input = forwardRef(({ 
  label,
  error,
  className,
  icon: Icon,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-dark-text mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'input',
            Icon && 'pl-10',
            error && 'input-error',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-error mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';