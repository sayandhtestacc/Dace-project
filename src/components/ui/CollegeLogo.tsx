import React from 'react'

export interface CollegeLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  withText?: boolean
  className?: string
}

export const CollegeLogo: React.FC<CollegeLogoProps> = ({
  size = 'md',
  withText = false,
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size]

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="/duk-logo.svg"
        alt="Digital University Kerala Logo"
        className={`${sizeMap} shrink-0 object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-105`}
      />
      {withText && (
        <div className="flex flex-col text-left">
          <span className="font-semibold text-sm tracking-tight text-[#141320] leading-tight">
            Digital University Kerala
          </span>
          <span className="text-[10px] text-[#64677A] font-medium leading-tight">
            KUDSIT · Trivandrum
          </span>
        </div>
      )}
    </div>
  )
}
