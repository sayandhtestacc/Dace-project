import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, ArrowLeft, X, Check, Compass, Shield, Utensils, QrCode } from 'lucide-react'
import { useStore } from '@/data/store'

export const EvaluatorTour: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isActive, setIsActive] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const location = useLocation()
  const navigate = useNavigate()
  const { switchRole } = useStore()

  // Check query param or custom trigger
  useEffect(() => {
    if (searchParams.get('tour') === 'true' || searchParams.get('tour') === '1') {
      setIsActive(true)
      setCurrentStep(1)
      switchRole('student')
      // remove param so reloads don't force it
      const newParams = new URLSearchParams(searchParams)
      newParams.delete('tour')
      setSearchParams(newParams, { replace: true })
    }
  }, [searchParams, setSearchParams, switchRole])

  // Listen for custom trigger event
  useEffect(() => {
    const handleStartTour = () => {
      setIsActive(true)
      setCurrentStep(1)
      switchRole('student')
      navigate('/app')
    }
    window.addEventListener('start-evaluator-tour', handleStartTour)
    return () => window.removeEventListener('start-evaluator-tour', handleStartTour)
  }, [navigate, switchRole])

  const steps = [
    {
      step: 1,
      role: 'student' as const,
      path: '/app/complaints',
      badge: 'Step 1 of 4 · Student Flow',
      title: 'Submit or Track a Complaint',
      desc: 'Browse active grievance tickets with real-time status and anonymous modes.',
      nextLabel: 'Proceed to Gate Scanner →',
    },
    {
      step: 2,
      role: 'student' as const,
      path: '/app/qr',
      badge: 'Step 2 of 4 · Gate QR Pass',
      title: 'Scan Gate Barrier (After-Hours)',
      desc: 'Switch to "Scan Gate QR" tab and simulate an After-Hours check-in.',
      nextLabel: 'Switch to Security Guard →',
    },
    {
      step: 3,
      role: 'security' as const,
      path: '/app/security',
      badge: 'Step 3 of 4 · Security Post',
      title: 'Live Gate Console & Verification',
      desc: 'Observe the 30s rotating kiosk token and verify student access logs.',
      nextLabel: 'Switch to Warden →',
    },
    {
      step: 4,
      role: 'warden' as const,
      path: '/app/warden',
      badge: 'Step 4 of 4 · Campus Executive',
      title: 'Warden Analytics & After-Hours Radar',
      desc: 'Inspect after-hours escalations, headcount charts, and service metrics.',
      nextLabel: 'Complete Walkthrough ✓',
    },
  ]

  const activeStepData = steps[currentStep - 1] || steps[0]

  const handleNext = () => {
    if (currentStep < steps.length) {
      const nextStepIndex = currentStep + 1
      const nextData = steps[nextStepIndex - 1]
      setCurrentStep(nextStepIndex)
      switchRole(nextData.role)
      navigate(nextData.path)
    } else {
      setIsActive(false)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      const prevStepIndex = currentStep - 1
      const prevData = steps[prevStepIndex - 1]
      setCurrentStep(prevStepIndex)
      switchRole(prevData.role)
      navigate(prevData.path)
    }
  }

  if (!isActive) return null

  return (
    <AnimatePresence>
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[80] w-[94%] max-w-2xl pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="bg-[#11101D] text-white rounded-[22px] p-4 sm:p-5 shadow-[0_20px_50px_rgba(17,16,29,0.45)] border border-white/15 backdrop-blur-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-white/10 text-[#C5CBE8]">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5CBE8]">
                {activeStepData.badge}
              </span>
            </div>
            <button
              onClick={() => setIsActive(false)}
              className="text-white/60 hover:text-white p-1 rounded-full cursor-pointer"
              aria-label="Dismiss tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 sm:mt-2.5">
            <h4 className="text-sm sm:text-base font-semibold text-white">
              {activeStepData.title}
            </h4>
            <p className="text-xs text-[#C9C7DA] mt-0.5 leading-relaxed">
              {activeStepData.desc}
            </p>
          </div>

          {/* Progress indicators and Action buttons */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {steps.map((s) => (
                <button
                  key={s.step}
                  onClick={() => {
                    setCurrentStep(s.step)
                    switchRole(s.role)
                    navigate(s.path)
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    s.step === currentStep
                      ? 'w-6 bg-[#C5CBE8]'
                      : s.step < currentStep
                      ? 'w-2 bg-white/40'
                      : 'w-2 bg-white/15'
                  }`}
                  aria-label={`Jump to Step ${s.step}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <button
                  onClick={handlePrev}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-[#141320] hover:bg-[#E9ECF6] active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <span>{activeStepData.nextLabel}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
