'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 ${className}`}
      style={{ borderColor: 'rgb(var(--border))' }}
      {...props}
    />
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 ${className}`}
      style={{ borderColor: 'rgb(var(--border))' }}
      {...props}
    />
  );
}
