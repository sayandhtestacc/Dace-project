import React from 'react'

export interface CollegeLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'mark' | 'full'
  withText?: boolean
  className?: string
}

export const CollegeLogo: React.FC<CollegeLogoProps> = ({
  size = 'md',
  variant = 'mark',
  withText = false,
  className = '',
}) => {
  const markSizeMap = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size]

  const fullHeightMap = {
    xs: 'h-6',
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  }[size]

  if (variant === 'full') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img
          src="/duk-logo.png"
          alt="Digital University Kerala - Curating a responsible digital world"
          className={`${fullHeightMap} w-auto object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-[1.02]`}
        />
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="/duk-mark.png"
        alt="Digital University Kerala"
        className={`${markSizeMap} shrink-0 object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-105 rounded-sm`}
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
