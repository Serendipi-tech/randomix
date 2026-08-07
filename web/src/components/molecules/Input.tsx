'use client';

import { useState, type InputHTMLAttributes } from 'react';

export type InputVariant = 'text' | 'password';

type ControlledProps = 'value' | 'onChange' | 'placeholder' | 'disabled' | 'className' | 'type' | 'name';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, ControlledProps> {
  variant?: InputVariant;
  value: string;
  onChangeText: (value: string) => void;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
}

// Focus (bordo primary) gestito internamente; variante password con toggle mostra/nascondi.
export function Input({
  variant = 'text',
  value,
  onChangeText,
  name,
  placeholder,
  disabled = false,
  label,
  required = false,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = variant === 'password';

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-text-color">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}
      <div
        className={`flex items-center gap-3 rounded-[10px] border-[1.5px] bg-foreground px-3.5 py-3 ${
          isFocused ? 'border-primary' : 'border-border'
        } ${disabled ? 'opacity-50' : ''}`}
      >
        <input
          {...rest}
          name={name}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          type={isPassword && !showPassword ? 'password' : 'text'}
          required={required}
          className="flex-1 bg-transparent text-sm text-text-color outline-none placeholder:text-disabled"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            disabled={disabled}
            aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
            className="text-disabled"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
