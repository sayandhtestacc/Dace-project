import React, { useState, useEffect, useRef } from 'react'
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
  Camera,
  AlertTriangle,
  Sparkles,
  Compass,
} from 'lucide-react'
import { useStore } from '@/data/store'
import { generateQRMatrix, renderQRToSVG } from '@/lib/qr'
import { formatDuration, relativeTime } from '@/lib/format'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { CollegeLogo } from '@/components/ui/CollegeLogo'

export default function GateQR() {
  const {
    currentStudentId,
    students,
    gateLogs,
    logEntry,
    logExit,
    logExitForStudent,
    activeGateToken,
    activeGateName,
    isGateAfterHoursMode,
  } = useStore()
  const { success, info, warning } = useToast()

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0]

  // Active visit status check
  const activeLog = gateLogs.find((l) => l.studentId === currentStudent.id && l.exitTime === null)

  // Dual Mode Tab: 'pass' (My Gate QR Pass) | 'scan' (Scan Gate QR)
  const [activeTab, setActiveTab] = useState<'pass' | 'scan'>('pass')

  // 30s QR Refresh state
  const [timestamp, setTimestamp] = useState<number>(Date.now())
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30)

  // 3D card flip toggle
  const [isFlipped, setIsFlipped] = useState<boolean>(false)

  // Purpose & Destination Form
  const [purpose, setPurpose] = useState<string>('Lab')
  const [destination, setDestination] = useState<string>('Main Academic Block')

  // After-hours detection & input
  const currentHour = new Date().getHours()
  const isAfterHours = currentHour >= 18 || currentHour < 8 || isGateAfterHoursMode
  const [afterHoursReason, setAfterHoursReason] = useState<string>('Research lab overtime')

  // Live timer for active visit
  const [elapsedMs, setElapsedMs] = useState<number>(0)

  // Camera stream for student scanning gate
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasCamera, setHasCamera] = useState<boolean>(false)
  const [isScanning, setIsScanning] = useState<boolean>(false)

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

  // Camera activation for Tab 2
  useEffect(() => {
    let stream: MediaStream | null = null
    if (activeTab === 'scan') {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s
          if (videoRef.current) {
            videoRef.current.srcObject = s
            setHasCamera(true)
          }
        })
        .catch(() => {
          setHasCamera(false)
        })
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop())
      }
    }
  }, [activeTab])

  // Generate QR SVG
  const qrMatrix = generateQRMatrix(currentStudent.id, timestamp)
  const qrSvg = renderQRToSVG(qrMatrix, 9)

  const handleLogEntry = () => {
    logEntry(currentStudent.id, purpose, destination, isAfterHours, activeGateName, 'guard_scanned_student')
    success(`Gate entry recorded: ${purpose} at ${destination}`)
  }

  const handleLogExit = () => {
    if (activeLog) {
      logExit(activeLog.id)
      setIsFlipped(false)
      success(`Gate exit logged. Total visit: ${formatDuration(Date.now() - activeLog.entryTime)}`)
    }
  }

  // Student scans Gate QR Code handlers
  const handleSimulateScanGateEntry = (late = false) => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      const p = late ? 'After-Hours Research' : purpose
      const d = destination || 'Main Campus'
      logEntry(currentStudent.id, p, d, late || isAfterHours, activeGateName, 'student_scanned_gate')
      success(`Scanned ${activeGateName} QR: Entry logged ${late ? '(After-Hours Notice)' : ''}`)
    }, 700)
  }

  const handleSimulateScanGateExit = () => {
    if (!activeLog) {
      warning('You are not currently marked inside the campus.')
      return
    }
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      logExitForStudent(currentStudent.id)
      success(`Scanned ${activeGateName} Exit QR: Check-out recorded. Total: ${formatDuration(elapsedMs)}`)
    }, 700)
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
            Module C · Bidirectional Gate Access
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight">
            Campus Gate Security
          </h1>
          <p className="text-xs sm:text-sm text-[#64677A] mt-1">
            Present your regenerating token to security guards or scan the gate kiosk QR directly.
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

      {/* Segmented Dual-Mode Pill Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-full bg-white border border-[#2B2644]/10 shadow-xs">
          <button
            onClick={() => setActiveTab('pass')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'pass'
                ? 'bg-[#2B2644] text-white shadow-xs'
                : 'text-[#64677A] hover:text-[#141320]'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>My Gate QR Pass</span>
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'scan'
                ? 'bg-[#2B2644] text-white shadow-xs'
                : 'text-[#64677A] hover:text-[#141320]'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Scan Gate QR</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MY GATE QR PASS */}
      {activeTab === 'pass' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left (5 cols): Dark #2B2644 SECURITY PASS card with 3D Flip */}
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

            <div className="perspective-[1200px] w-full">
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full [transform-style:preserve-3d] min-h-[460px] cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* FRONT: Dark #2B2644 SECURITY PASS */}
                <div className="absolute inset-0 w-full h-full bg-[#2B2644] text-white rounded-[24px] p-7 border border-white/10 shadow-xl flex flex-col justify-between [backface-visibility:hidden]">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold tracking-wider uppercase text-[#E9ECF6]">
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
                              stroke="#C5CBE8"
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
                    <span className="font-mono text-white font-bold">
                      {activeLog ? formatDuration(elapsedMs) : 'Ready at Gate'}
                    </span>
                  </div>
                </div>

                {/* BACK: Pass Regulations & Barcode */}
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
                        <span className="font-mono text-white">0471-2788000</span>
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

          {/* Right (7 cols): Status & Action card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[24px] p-8 space-y-6 border border-[#2B2644]/8 shadow-[0_8px_30px_rgba(43,38,68,0.05)]">
              {activeLog ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#2B2644]/8">
                    <div>
                      <h3 className="text-base font-bold text-[#141320]">Currently On Campus</h3>
                      <p className="text-xs text-[#64677A]">Active visit recorded at security gate turnstile</p>
                    </div>
                    <Badge variant="purple">
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
                      <span className="text-sm font-mono font-bold text-[#2B2644] mt-0.5 block">
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
                    <Badge variant="neutral">Off Campus</Badge>
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
      )}

      {/* TAB 2: SCAN GATE QR (STUDENT SCANS GATE BARRIER) */}
      {activeTab === 'scan' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-[24px] p-8 border border-[#2B2644]/8 shadow-[0_8px_30px_rgba(43,38,68,0.05)]">
            <div className="flex items-center justify-between pb-4 border-b border-[#2B2644]/8">
              <div>
                <h3 className="text-base font-bold text-[#141320]">Gate Kiosk Scanner</h3>
                <p className="text-xs text-[#64677A]">Point your phone camera at the physical QR code on Gate 1 or Gate 2</p>
              </div>
              <Badge variant={isAfterHours ? 'warning' : 'purple'}>
                {isAfterHours ? 'After-Hours Active' : 'Normal Hours'}
              </Badge>
            </div>

            {/* After-Hours Alert Notice */}
            {isAfterHours && (
              <div className="mt-4 p-4 rounded-[18px] bg-[#2B2644]/5 border border-[#2B2644]/15 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#2B2644] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#141320]">After-Hours Protocol (6:00 PM – 8:00 AM)</h4>
                  <p className="text-xs text-[#64677A] mt-0.5">
                    Entries logged during night hours require an official research, project, or residential rationale for security logs.
                  </p>
                  <input
                    type="text"
                    value={afterHoursReason}
                    onChange={(e) => setAfterHoursReason(e.target.value)}
                    placeholder="Enter reason for late entry..."
                    className="mt-2 w-full px-3 py-1.5 text-xs bg-white rounded-[10px] border border-[#2B2644]/12 text-[#141320] outline-none"
                  />
                </div>
              </div>
            )}

            {/* Viewfinder simulation / live camera element */}
            <div className="my-6 relative w-full h-64 bg-[#11101D] rounded-[20px] overflow-hidden flex flex-col items-center justify-center text-white border border-[#2B2644]/20 shadow-inner">
              {hasCamera ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Camera className="w-10 h-10 text-white/40 mx-auto" />
                  <span className="text-xs font-semibold block text-white/80">Optical Scanner Standby</span>
                  <p className="text-[11px] text-white/50 max-w-sm">
                    Detecting Gate Post: <span className="text-white font-mono">{activeGateName}</span> ({activeGateToken})
                  </p>
                </div>
              )}

              {/* Viewfinder Target Reticle */}
              <div className="absolute inset-8 border-2 border-dashed border-white/30 rounded-[16px] pointer-events-none flex items-center justify-center">
                {/* Laser scan line animation */}
                <motion.div
                  animate={{ y: [-70, 70, -70] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                  className="w-full h-0.5 bg-[#C5CBE8] shadow-[0_0_12px_#C5CBE8]"
                />
              </div>

              {isScanning && (
                <div className="absolute inset-0 bg-[#2B2644]/80 backdrop-blur-xs flex items-center justify-center">
                  <div className="text-center text-white space-y-2">
                    <Sparkles className="w-8 h-8 animate-spin mx-auto text-[#C5CBE8]" />
                    <span className="text-xs font-bold">Decrypting Gate Token...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Simulate Buttons for 5-Minute Committee Demo */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] uppercase font-bold text-[#64677A] tracking-wider block">
                Live Turnstile Test Simulators
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSimulateScanGateEntry(false)}
                  iconLeft={<ShieldCheck className="w-3.5 h-3.5" />}
                  className="w-full"
                >
                  Scan Gate Entry
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSimulateScanGateExit}
                  iconLeft={<LogOut className="w-3.5 h-3.5" />}
                  className="w-full"
                >
                  Scan Gate Exit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSimulateScanGateEntry(true)}
                  iconLeft={<Clock className="w-3.5 h-3.5" />}
                  className="w-full border-amber-300 hover:bg-amber-50 text-[#141320]"
                >
                  Scan After-Hours Entry
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
