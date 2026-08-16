'use client';

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600',
  secondary: 'border hover:bg-[rgb(var(--surface-2))]',
  ghost: 'hover:bg-[rgb(var(--surface-2))]',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      style={variant === 'secondary' ? { borderColor: 'rgb(var(--border))' } : undefined}
      {...props}
    />
  );
}
