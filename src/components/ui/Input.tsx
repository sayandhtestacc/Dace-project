import React, { useState } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  value,
  maxLength,
  className = '',
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const currentLength = typeof value === 'string' ? value.length : 0
  const hasValue = value !== undefined && value !== ''

  return (
    <div className="w-full">
      <div className="relative">
        <input
          ref={ref}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          onFocus={(e) => {
            setIsFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            onBlur?.(e)
          }}
          className={`peer w-full h-[54px] px-4 pt-5 pb-1 text-sm bg-white rounded-[16px] border text-[#141320] outline-none transition-all duration-200 placeholder-transparent ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 animate-[shake_0.4s_ease-in-out]'
              : 'border-[rgba(43,38,68,0.12)] focus:border-[#2B2644] focus:ring-2 focus:ring-[rgba(43,38,68,0.08)]'
          } ${className}`}
          placeholder={label}
          {...props}
        />
        <label
          className={`absolute left-4 pointer-events-none transition-all duration-200 select-none ${
            isFocused || hasValue
              ? 'top-1.5 text-[11px] font-medium text-[#64677A]'
              : 'top-4 text-sm text-[#64677A]'
          }`}
        >
          {label}
        </label>
      </div>

      <div className="flex items-center justify-between mt-1 px-1">
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[#64677A]">{hint}</p>
        ) : <span />}

        {maxLength && (
          <span className="text-[11px] text-[#64677A]">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
})

Input.displayName = 'Input'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  hint,
  value,
  maxLength,
  rows = 4,
  className = '',
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const currentLength = typeof value === 'string' ? value.length : 0
  const hasValue = value !== undefined && value !== ''

  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          ref={ref}
          value={value}
          maxLength={maxLength}
          rows={rows}
          onChange={onChange}
          onFocus={(e) => {
            setIsFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            onBlur?.(e)
          }}
          className={`peer w-full px-4 pt-6 pb-2 text-sm bg-white rounded-[16px] border text-[#141320] outline-none transition-all duration-200 placeholder-transparent resize-none ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 animate-[shake_0.4s_ease-in-out]'
              : 'border-[rgba(43,38,68,0.12)] focus:border-[#2B2644] focus:ring-2 focus:ring-[rgba(43,38,68,0.08)]'
          } ${className}`}
          placeholder={label}
          {...props}
        />
        <label
          className={`absolute left-4 pointer-events-none transition-all duration-200 select-none ${
            isFocused || hasValue
              ? 'top-2 text-[11px] font-medium text-[#64677A]'
              : 'top-4 text-sm text-[#64677A]'
          }`}
        >
          {label}
        </label>
      </div>

      <div className="flex items-center justify-between mt-1 px-1">
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[#64677A]">{hint}</p>
        ) : <span />}

        {maxLength && (
          <span className="text-[11px] text-[#64677A]">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
})

Textarea.displayName = 'Textarea'
