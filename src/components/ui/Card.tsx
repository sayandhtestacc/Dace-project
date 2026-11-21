import React, { useRef, useState } from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'dark' | 'gradient' | 'bordered'
  tilt?: boolean
  spotlight?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  tilt = false,
  spotlight = false,
  className = '',
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tiltStyle, setTiltStyle] = useState<{ transform: string }>({ transform: '' })
  const [spotlightPos, setSpotlightPos] = useState<{ x: number; y: number; opacity: number }>({ x: 0, y: 0, opacity: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (spotlight) {
      setSpotlightPos({ x, y, opacity: 1 })
    }

    if (tilt) {
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -6
      const rotateY = ((x - centerX) / centerX) * 6
      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`,
      })
    }
  }

  const handleMouseLeave = () => {
    if (tilt) {
      setTiltStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' })
    }
    if (spotlight) {
      setSpotlightPos(prev => ({ ...prev, opacity: 0 }))
    }
  }

  const variantStyles = {
    elevated: 'bg-white text-[#141320] border border-[rgba(43,38,68,0.08)] shadow-[0_4px_24px_-4px_rgba(43,38,68,0.08)] hover:shadow-[0_12px_40px_-8px_rgba(43,38,68,0.18)] hover:-translate-y-1',
    dark: 'bg-[#2B2644] text-white border border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_-8px_rgba(43,38,68,0.2)]',
    gradient: 'bg-gradient-to-b from-[#E9ECF6] to-[#C5CBE8] text-[#141320] border border-[rgba(43,38,68,0.12)] shadow-[0_4px_24px_-4px_rgba(43,38,68,0.08)]',
    bordered: 'bg-transparent border border-[rgba(43,38,68,0.12)] text-[#141320]',
  }[variant]

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...tiltStyle,
        transition: 'transform 0.15s ease-out, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      className={`relative rounded-[24px] overflow-hidden ${variantStyles} ${className}`}
      {...props}
    >
      {spotlight && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: spotlightPos.opacity,
            background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(197, 203, 232, 0.22), transparent 70%)`,
          }}
        />
      )}
      {children}
    </div>
  )
}
