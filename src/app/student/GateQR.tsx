import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
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

  // Manual 3D flip toggle
  const [isFlipped, setIsFlipped] = useState<boolean>(false)

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
      setIsFlipped(false)
      success(`Gate exit logged. Total visit: ${formatDuration(Date.now() - activeLog.entryTime)}`)
    }
  }

  // Circular ring countdown SVG calculation
  const circleRadius = 14
  const circumference = 2 * Math.PI * circleRadius
  const strokeDashoffset = circumference - (secondsRemaining / 30) * circumference

  return (
    <div className="space-y-8 pb-16">
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
          <Link to="/app/gate/history">
            <Button variant="outline" size="sm" iconLeft={<History className="w-3.5 h-3.5" />}>
              Visit History
            </Button>
          </Link>
        </div>
      </div>

      {/* 2-Column Split: grid grid-cols-1 lg:grid-cols-12 gap-8 items-start */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left (5 cols): Dark #2B2644 SECURITY PASS card */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider">
              Cryptographic Token
            </span>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="text-xs text-[#2B2644] hover:underline flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isFlipped ? 'Show QR Code' : 'Flip Card'}</span>
            </button>
          </div>

          <div className="perspective-1000">
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', damping: 20 }}
              className="relative w-full [transform-style:preserve-3d] min-h-[460px] cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* FRONT: Dark #2B2644 SECURITY PASS */}
              <div className="absolute inset-0 w-full h-full bg-[#2B2644] text-white rounded-[24px] p-7 border border-white/10 shadow-xl flex flex-col justify-between [backface-visibility:hidden]">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-bold tracking-wider uppercase text-emerald-300">
                        {activeLog ? 'ACTIVE VISIT' : 'PASS READY'}
                      </span>
                    </div>

                    {/* Circular 30s Countdown Ring */}
                    <div className="flex items-center gap-2">
                      <div className="relative w-7 h-7 flex items-center justify-center">
                        <svg className="w-7 h-7 -rotate-90">
                          <circle
                            cx="14"
                            cy="14"
                            r={circleRadius}
                            stroke="rgba(255,255,255,0.15)"
                            strokeWidth="2.5"
                            fill="none"
                          />
                          <circle
                            cx="14"
                            cy="14"
                            r={circleRadius}
                            stroke="#34D399"
                            strokeWidth="2.5"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-[9px] font-mono font-bold text-white">
                          {secondsRemaining}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#C9C7DA]">30s Loop</span>
                    </div>
                  </div>

                  {/* Centered QR code container */}
                  <div className="my-5 flex flex-col items-center justify-center">
                    <div className="bg-white p-3 rounded-[16px] shadow-lg">
                      <div
                        className="w-44 h-44 flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: qrSvg }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-[#C9C7DA] mt-3">
                      TOKEN: {currentStudent.qrToken}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#C9C7DA]">
                  <span>{currentStudent.name}</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {activeLog ? formatDuration(elapsedMs) : 'Ready at Gate'}
                  </span>
                </div>
              </div>

              {/* BACK: Pass Rules & Emergency Barcode */}
              <div className="absolute inset-0 w-full h-full bg-[#11101D] text-white rounded-[24px] p-7 border border-white/10 shadow-xl flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs font-bold tracking-wider uppercase text-[#C5CBE8]">
                      CAMPUS GATE REGULATIONS
                    </span>
                    <span className="text-[10px] text-[#C9C7DA]">Technopark IV</span>
                  </div>

                  <div className="my-5 space-y-3 text-xs text-[#C9C7DA]">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-white/50 block">Authorized Scholar</span>
                      <span className="text-white font-medium">{currentStudent.name} ({currentStudent.department})</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-white/50 block">Campus Security Hotline</span>
                      <span className="font-mono text-emerald-400">0471-2788000</span>
                    </div>
                    <p className="text-[11px] text-[#C9C7DA] leading-relaxed pt-2">
                      Passes are dynamically signed and must be verified at security barriers. Turnstile logs auto-expire after 90 days.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 text-center">
                  <div className="h-8 w-full bg-white/10 rounded-[8px] flex items-center justify-center">
                    <span className="text-[10px] font-mono text-white tracking-[0.3em]">|||| | |||||| || |||||</span>
                  </div>
                  <span className="text-[10px] text-[#C9C7DA] mt-1 block">Click to flip back</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right (7 cols): Status & Log Out & Close Visit action card */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[24px] p-8 space-y-6 border border-[#2B2644]/8 shadow-[0_8px_30px_rgba(43,38,68,0.05)]">
            {activeLog ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#2B2644]/8">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <div>
                      <h3 className="text-base font-bold text-[#141320]">Currently On Campus</h3>
                      <p className="text-xs text-[#64677A]">Active visit recorded at security gate turnstile</p>
                    </div>
                  </div>
                  <Badge variant="success" pulse>
                    Inside Campus
                  </Badge>
                </div>

                {/* Visit summary details */}
                <div className="grid grid-cols-2 gap-4 p-5 rounded-[18px] bg-[#F5F6FA] border border-[#2B2644]/6">
                  <div>
                    <span className="text-[10px] text-[#64677A] uppercase font-bold block">Declared Purpose</span>
                    <span className="text-sm font-semibold text-[#141320] mt-0.5 block">{activeLog.purpose}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64677A] uppercase font-bold block">Campus Destination</span>
                    <span className="text-sm font-semibold text-[#141320] mt-0.5 block truncate">{activeLog.destination}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64677A] uppercase font-bold block">Entry Check-In</span>
                    <span className="text-xs text-[#64677A] mt-0.5 block">
                      {new Date(activeLog.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64677A] uppercase font-bold block">Elapsed Stay Time</span>
                    <span className="text-sm font-mono font-bold text-emerald-600 mt-0.5 block">
                      {formatDuration(elapsedMs)}
                    </span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleLogExit}
                  className="w-full bg-[#2B2644] text-white hover:bg-[#11101D]"
                  iconRight={<LogOut className="w-4 h-4" />}
                >
                  Log Out & Close Visit
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-[#2B2644]/8">
                  <div>
                    <h3 className="text-base font-bold text-[#141320]">Log Campus Entry</h3>
                    <p className="text-xs text-[#64677A]">Declare your visit destination before scanning at the turnstile</p>
                  </div>
                  <Badge variant="purple">Off Campus</Badge>
                </div>

                {/* Purpose Pills */}
                <div>
                  <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-2">
                    Select Visit Purpose
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {purposes.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPurpose(p)}
                        className={`px-4 py-2 text-xs rounded-full font-medium transition-all cursor-pointer ${
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

                {/* Destination Input */}
                <div>
                  <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1.5">
                    Campus Destination
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full h-11 px-4 text-xs rounded-[14px] bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] outline-none focus:border-[#2B2644]"
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
