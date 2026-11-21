import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-[#2B2644] text-white rounded-full shadow-[0_8px_24px_-4px_rgba(43,38,68,0.25)] hover:bg-[#11101D] active:scale-95 transition-all text-xs font-medium cursor-pointer"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Top</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
