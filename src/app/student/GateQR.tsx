import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  QrCode,
  Clock,
  MapPin,
  CheckCircle2,
  LogOut,
  History,
  RotateCw,
  ShieldCheck,
  Building,
  Sparkles,
} from 'lucide-react'
import { useStore } from '@/data/store'
import { generateQRMatrix, renderQRToSVG } from '@/lib/qr'
import { formatDuration, relativeTime } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'

export default function GateQR() {
  const { currentStudentId, students, gateLogs, logEntry, logExit } = useStore()
  const { success, info } = useToast()

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0]

  // Check if currently on campus
  const activeLog = gateLogs.find((l) => l.studentId === currentStudent.id && l.exitTime === null)

  // 30s QR Refresh state
  const [timestamp, setTimestamp] = useState<number>(Date.now())
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30)

  // Manual flip toggle (or automatically flipped if active visit)
  const [isFlippedManual, setIsFlippedManual] = useState<boolean>(false)

  // Purpose & Destination Form
  const [purpose, setPurpose] = useState<string>('Lab')
  const [destination, setDestination] = useState<string>('Main Academic Block')

  // Live timer for active visit
  const [elapsedMs, setElapsedMs] = useState<number>(0)

  const purposes = ['Class', 'Library', 'Lab', 'Project work', 'Hostel', 'Event', 'Other']

  // 30s countdown loop
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setTimestamp(Date.now())
          return 30
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Active visit elapsed timer
  useEffect(() => {
    if (!activeLog) return
    const updateElapsed = () => {
      setElapsedMs(Date.now() - activeLog.entryTime)
    }
    updateElapsed()
    const timer = setInterval(updateElapsed, 1000)
    return () => clearInterval(timer)
  }, [activeLog])

  // Is flipped if active visit or if user clicked flip card
  const isCardFlipped = Boolean(activeLog) || isFlippedManual

  // Generate QR SVG
  const qrMatrix = generateQRMatrix(currentStudent.id, timestamp)
  const qrSvg = renderQRToSVG(qrMatrix, 9)

  const handleLogEntry = () => {
    logEntry(currentStudent.id, purpose, destination)
    success(`Gate entry recorded: ${purpose} at ${destination}`)
  }

  const handleLogExit = () => {
    if (activeLog) {
      logExit(activeLog.id)
      setIsFlippedManual(false)
      success(`Gate exit logged. Total visit: ${formatDuration(Date.now() - activeLog.entryTime)}`)
    }
  }

  // Circular ring countdown SVG calculation
  const circleRadius = 14
  const circumference = 2 * Math.PI * circleRadius
  const strokeDashoffset = circumference - (secondsRemaining / 30) * circumference

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
            Module C · Gate Access Log
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight">
            Security QR Pass
          </h1>
          <p className="text-xs sm:text-sm text-[#64677A] mt-1">
            Cryptographically refreshing campus entry token. Zero physical registers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFlippedManual(!isFlippedManual)}
            iconLeft={<RotateCw className="w-3.5 h-3.5" />}
          >
            Flip Card
          </Button>
          <Link to="/app/gate/history">
            <Button variant="outline" size="sm" iconLeft={<History className="w-3.5 h-3.5" />}>
              Visit History
            </Button>
          </Link>
        </div>
      </div>

      {/* 8.1 3D Flip Pass Card Container */}
      <div className="perspective-1000">
        <motion.div
          animate={{ rotateY: isCardFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', damping: 20 }}
          className="relative w-full [transform-style:preserve-3d] min-h-[500px]"
        >
          {/* FRONT FACE: QR GENERATOR & ENTRY FORM */}
          <div
            className={`w-full bg-white rounded-[28px] p-6 sm:p-9 border border-[rgba(43,38,68,0.1)] shadow-xl flex flex-col items-center justify-between [backface-visibility:hidden] ${
              isCardFlipped ? 'pointer-events-none' : ''
            }`}
          >
            {/* Countdown Badge & Title */}
            <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-[rgba(43,38,68,0.06)]">
              <Badge variant="purple" pulse>
                Active QR Pass
              </Badge>

              {/* Circular 30s Countdown Ring */}
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <svg className="w-8 h-8 -rotate-90">
                    <circle
                      cx="16"
                      cy="16"
                      r={circleRadius}
                      stroke="rgba(43,38,68,0.1)"
                      strokeWidth="3"
                      fill="none"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r={circleRadius}
                      stroke="#2B2644"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-mono font-bold text-[#2B2644]">
                    {secondsRemaining}
                  </span>
                </div>
                <span className="text-[11px] text-[#64677A] font-medium">Refreshes in {secondsRemaining}s</span>
              </div>
            </div>

            {/* Generated QR Code (SVG) */}
            <div className="p-4 bg-white rounded-[22px] border border-[rgba(43,38,68,0.12)] shadow-xs flex flex-col items-center my-3">
              <div
                dangerouslySetInnerHTML={{ __html: qrSvg }}
                className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center"
              />
              <span className="text-[11px] font-mono text-[#64677A] mt-3 font-semibold tracking-wider">
                {qrMatrix.token}
              </span>
            </div>

            <p className="text-xs text-[#64677A] text-center my-2 max-w-sm">
              Present this token at Campus Security Barrier Gate 1 or Gate 2
            </p>

            {/* Purpose & Destination Selector */}
            <div className="w-full space-y-4 pt-4 border-t border-[rgba(43,38,68,0.06)] text-left">
              <div>
                <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-2">
                  Select Visit Purpose
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {purposes.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPurpose(p)}
                      className={`px-3.5 py-1.5 text-xs rounded-full font-medium transition-all cursor-pointer ${
                        purpose === p
                          ? 'bg-[#2B2644] text-white shadow-xs'
                          : 'bg-[#F5F6FA] text-[#64677A] hover:bg-[#E9ECF6]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1.5">
                  Destination on Campus
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full h-11 px-4 text-xs rounded-full bg-[#F5F6FA] border border-[rgba(43,38,68,0.1)] text-[#141320] outline-none"
                  placeholder="e.g. Main Academic Block, ECE Computing Lab"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleLogEntry}
                className="w-full mt-2"
                iconRight={<ShieldCheck className="w-4 h-4" />}
              >
                Log Entry Into Campus
              </Button>
            </div>
          </div>

          {/* BACK FACE: ACTIVE VISIT PASS & LOG OUT / CLOSE CONTROLS */}
          <div
            className={`absolute inset-0 w-full bg-gradient-to-br from-[#2B2644] via-[#1E1933] to-[#11101D] text-white rounded-[28px] p-6 sm:p-9 border border-white/10 shadow-2xl flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] ${
              !isCardFlipped ? 'pointer-events-none' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold tracking-wider uppercase text-emerald-300">
                    {activeLog ? 'Active On-Campus Visit' : 'Gate Pass Back / Rules'}
                  </span>
                </div>
                <button
                  onClick={() => setIsFlippedManual(false)}
                  className="text-xs text-[#C9C7DA] hover:text-white underline cursor-pointer"
                >
                  Flip to QR
                </button>
              </div>

              {/* Student Identity */}
              <div className="my-6">
                <span className="text-[10px] text-[#C9C7DA] uppercase tracking-wider block font-bold">Scholar</span>
                <h3 className="text-2xl font-bold text-white">{currentStudent.name}</h3>
                <p className="text-xs text-[#C9C7DA] mt-0.5">
                  {currentStudent.department} (Year {currentStudent.year}) · {currentStudent.email}
                </p>
              </div>

              {/* Visit Details */}
              <div className="grid grid-cols-2 gap-4 p-5 rounded-[20px] bg-white/5 border border-white/10 mb-6">
                <div>
                  <span className="text-[10px] text-[#C9C7DA] uppercase font-bold block">Entry Purpose</span>
                  <span className="text-sm font-semibold text-white">
                    {activeLog ? activeLog.purpose : purpose}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#C9C7DA] uppercase font-bold block">Destination</span>
                  <span className="text-sm font-semibold text-white truncate block">
                    {activeLog ? activeLog.destination : destination}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#C9C7DA] uppercase font-bold block">Time In</span>
                  <span className="text-xs text-white">
                    {activeLog ? new Date(activeLog.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Simulated Entry'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#C9C7DA] uppercase font-bold block">Elapsed Time</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    {activeLog ? formatDuration(elapsedMs) : '0s'}
                  </span>
                </div>
              </div>
            </div>

            {/* Exit Action & Close Visit */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              {activeLog ? (
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleLogExit}
                  className="w-full bg-white text-[#11101D] hover:bg-[#E9ECF6] border-none font-bold"
                  iconRight={<LogOut className="w-4 h-4" />}
                >
                  Log Out & Close Visit
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setIsFlippedManual(false)}
                  className="w-full bg-white/10 text-white hover:bg-white hover:text-[#2B2644] border-white/20"
                >
                  Return to Active QR
                </Button>
              )}
              <p className="text-[11px] text-center text-[#C9C7DA]">
                Turnstile Gate 1 & 2 automated recording · Auto-retention 90 days.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Security Privacy Ethics Card */}
      <div className="p-5 rounded-[20px] bg-[#E9ECF6]/60 border border-[rgba(43,38,68,0.08)] text-xs text-[#2B2644] leading-relaxed">
        <span className="font-bold block mb-1">Campus Privacy & Safety Note:</span>
        Gate records store broad purpose and destination for emergency headcounts and campus integrity. Records are confidential, visible only to authorized security and warden personnel, and auto-expire after 90 days.
      </div>
    </div>
  )
}
