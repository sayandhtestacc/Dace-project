import React from 'react'

export interface SkeletonProps {
  className?: string
  variant?: 'text' | 'card' | 'circle' | 'rect'
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    card: 'h-48 w-full rounded-[24px]',
    circle: 'w-10 h-10 rounded-full',
    rect: 'h-24 w-full rounded-[16px]',
  }[variant]

  return (
    <div
      className={`relative overflow-hidden bg-[rgba(43,38,68,0.06)] ${variantStyles} ${className}`}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(197, 203, 232, 0.35) 50%, transparent 100%)',
        }}
      />
    </div>
  )
}
