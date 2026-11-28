'use client';

import { useState, type TextareaHTMLAttributes } from 'react';

type ControlledProps = 'value' | 'onChange' | 'placeholder' | 'disabled' | 'className' | 'name';

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, ControlledProps> {
  value: string;
  onChangeText: (value: string) => void;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  /** Righe visibili a riposo: il campo cresce comunque con il contenuto. */
  rows?: number;
}

/** Campo di testo su più righe: stessa cornice di Input, ma conserva gli a capo digitati — il
 *  corpo di una notifica arriva all'app così com'è scritto qui. */
export function Textarea({
  value,
  onChangeText,
  name,
  placeholder,
  disabled = false,
  label,
  required = false,
  rows = 5,
  ...rest
}: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-text-color">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}
      <div
        className={`rounded-[10px] border-[1.5px] bg-foreground px-3.5 py-3 ${
          isFocused ? 'border-primary' : 'border-border'
        } ${disabled ? 'opacity-50' : ''}`}
      >
        <textarea
          {...rest}
          name={name}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className="w-full resize-y bg-transparent text-sm text-text-color outline-none placeholder:text-disabled"
        />
      </div>
    </div>
  );
}
