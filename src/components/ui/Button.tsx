import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  loading = false,
  className = '',
  disabled,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-xs h-[36px]',
    md: 'px-5 py-2.5 text-sm h-[44px]',
    lg: 'px-7 py-3 text-base h-[50px]',
  }[size]

  const variantClasses = {
    primary: 'bg-[#11101D] text-white hover:bg-[#2B2644] active:scale-[0.98] shadow-sm',
    secondary: 'bg-[#2B2644] text-white hover:bg-[#11101D] active:scale-[0.98]',
    outline: 'border border-[rgba(43,38,68,0.2)] text-[#141320] bg-transparent hover:bg-[#2B2644] hover:text-white hover:border-[#2B2644] transition-colors duration-200',
    ghost: 'text-[#141320] hover:bg-[rgba(43,38,68,0.06)] active:scale-[0.98]',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
  }[variant]

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none group ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : iconLeft ? (
        <span className="mr-2 transition-transform duration-200 group-hover:-translate-x-0.5">{iconLeft}</span>
      ) : null}
      <span>{children}</span>
      {!loading && iconRight && (
        <span className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5">{iconRight}</span>
      )}
    </button>
  )
})

Button.displayName = 'Button'
