import React, { useState, useEffect, useRef } from 'react'
import {
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  UserPlus,
  Download,
  Plus,
  QrCode,
  Camera,
  Maximize2,
  Copy,
  Check,
  RotateCw,
  LogOut,
  Users,
} from 'lucide-react'
import { useStore } from '@/data/store'
import { formatDuration, relativeTime } from '@/lib/format'
import { generateQRMatrix, renderQRToSVG } from '@/lib/qr'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { CollegeLogo } from '@/components/ui/CollegeLogo'

export default function AdminGate() {
  const {
    gateLogs,
    students,
    visitors,
    logEntry,
    logExit,
    logExitForStudent,
    addVisitor,
    activeGateToken,
    activeGateName,
    isGateAfterHoursMode,
    setGateName,
    setGateAfterHoursMode,
    rotateGateToken,
  } = useStore()
  const { success, info, warning } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState<'all' | 'inside' | 'outside' | 'afterhours'>('all')

  // Security Scanner: Selected student for simulated check
  const [scannedStudentId, setScannedStudentId] = useState<string>(students[0]?.id || '')
  const selectedStudent = students.find((s) => s.id === scannedStudentId) || students[0]
  const studentActiveLog = gateLogs.find((l) => l.studentId === selectedStudent?.id && l.exitTime === null)

  const [scanPurpose, setScanPurpose] = useState('Lab')
  const [scanDestination, setScanDestination] = useState('Computing Cluster')

  // Live rotating gate QR 30s timer
  const [qrSecondsLeft, setQrSecondsLeft] = useState(30)
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false)
  const [copiedToken, setCopiedToken] = useState(false)

  // Camera stream for Security Guard Scanner
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasCamera, setHasCamera] = useState(false)

  // Visitor Pass Modal State
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false)
  const [visitorName, setVisitorName] = useState('')
  const [visitorPhone, setVisitorPhone] = useState('')
  const [visitorPurpose, setVisitorPurpose] = useState('Parent visit')
  const [visitorHostId, setVisitorHostId] = useState(students[0]?.id || '')

  // 30s gate QR auto-refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setQrSecondsLeft((prev) => {
        if (prev <= 1) {
          rotateGateToken()
          return 30
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [rotateGateToken])

  // Camera preview setup
  useEffect(() => {
    let stream: MediaStream | null = null
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then((s) => {
        stream = s
        if (videoRef.current) {
          videoRef.current.srcObject = s
          setHasCamera(true)
        }
      })
      .catch(() => setHasCamera(false))

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  // Currently inside on campus
  const currentlyInside = gateLogs.filter((l) => l.exitTime === null)

  // Filtered log items
  const filteredLogs = gateLogs.filter((l) => {
    if (filterMode === 'inside' && l.exitTime !== null) return false
    if (filterMode === 'outside' && l.exitTime === null) return false
    if (filterMode === 'afterhours' && !l.isAfterHours) return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        l.studentName.toLowerCase().includes(q) ||
        l.department.toLowerCase().includes(q) ||
        l.destination.toLowerCase().includes(q) ||
        (l.gateName && l.gateName.toLowerCase().includes(q))
      )
    }
    return true
  })

  // Security approves entry
  const handleApproveEntry = () => {
    if (studentActiveLog) {
      warning(`${selectedStudent.name} is already logged inside campus.`)
      return
    }
    logEntry(
      selectedStudent.id,
      scanPurpose,
      scanDestination,
      isGateAfterHoursMode,
      activeGateName,
      'guard_scanned_student'
    )
    success(`Entry approved: ${selectedStudent.name} at ${activeGateName}`)
  }

  // Security approves exit
  const handleApproveExit = () => {
    if (!studentActiveLog) {
      warning(`${selectedStudent.name} is not marked on campus.`)
      return
    }
    logExit(studentActiveLog.id)
    success(`Exit approved: ${selectedStudent.name}. Log closed.`)
  }

  const handleCopyToken = () => {
    navigator.clipboard.writeText(activeGateToken)
    setCopiedToken(true)
    setTimeout(() => setCopiedToken(false), 2000)
    info('Gate token copied to clipboard')
  }

  const handleCreateVisitor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!visitorName.trim() || !visitorPhone.trim()) return

    const host = students.find((s) => s.id === visitorHostId)
    addVisitor({
      name: visitorName.trim(),
      phone: visitorPhone.trim(),
      hostStudentId: visitorHostId,
      hostStudentName: host?.name || 'Student',
      purpose: visitorPurpose,
      validUntil: Date.now() + 4 * 3600000,
    })

    setIsVisitorModalOpen(false)
    setVisitorName('')
    setVisitorPhone('')
    success('Visitor pass issued successfully!')
  }

  const handleExportCSV = () => {
    const headers = ['ID,Student,Department,Purpose,Destination,Gate,AfterHours,EntryTime,ExitTime\n']
    const rows = gateLogs.map(
      (l) =>
        `"${l.id}","${l.studentName}","${l.department}","${l.purpose}","${l.destination}","${
          l.gateName || 'Main Gate 1'
        }","${l.isAfterHours ? 'YES' : 'NO'}","${new Date(l.entryTime).toISOString()}","${
          l.exitTime ? new Date(l.exitTime).toISOString() : 'ACTIVE'
        }"\n`
    )
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `duk-campus-gate-logs.csv`
    a.click()
    URL.revokeObjectURL(url)
    success('Exported all gate logs')
  }

  // Gate QR Code matrix
  const gateQrMatrix = generateQRMatrix(`GATE_${activeGateName}`, Date.now())
  const gateQrSvg = renderQRToSVG(gateQrMatrix, 8)

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider">
              Security Gate Console
            </span>
            <Badge variant="purple">LIVE TURNSTILE</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight mt-1">
            Gate Occupancy & Turnstile Radar
          </h1>
          <p className="text-xs sm:text-sm text-[#64677A] mt-1">
            Bi-directional verification, rotating gate kiosk token, and student camera check-ins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            iconLeft={<Download className="w-3.5 h-3.5" />}
          >
            Export Logs
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsVisitorModalOpen(true)}
            iconLeft={<UserPlus className="w-3.5 h-3.5" />}
          >
            Issue Visitor Pass
          </Button>
        </div>
      </div>

      {/* Campus Occupancy Hero Strip */}
      <Card
        variant="dark"
        className="p-8 sm:p-10 relative overflow-hidden bg-gradient-to-r from-[#2B2644] to-[#11101D]"
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider text-[#C9C7DA] font-semibold">
                Live Campus Occupancy
              </span>
            </div>
            <div className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
              {currentlyInside.length}{' '}
              <span className="text-xl font-normal text-[#C9C7DA]">Scholars on campus</span>
            </div>
            <p className="text-xs text-[#C9C7DA] mt-2">
              Turnstiles synchronized across {activeGateName} with zero paper logs.
            </p>
          </div>

          <div className="flex flex-col gap-1 text-right sm:border-l sm:border-white/10 sm:pl-8">
            <span className="text-xs text-[#C9C7DA]">Total Visits Logged</span>
            <span className="text-2xl font-bold text-white">{gateLogs.length}</span>
            <span className="text-[11px] text-[#C5CBE8]">Automated 30s Key Turnover</span>
          </div>
        </div>
      </Card>

      {/* MODULE 1 & MODULE 2: ROTATING GATE QR + SECURITY SCANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* MODULE 1 (5 cols): LIVE ROTATING GATE QR DISPLAY */}
        <div className="lg:col-span-5 space-y-4">
          <Card variant="elevated" className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#141320]">Gate Kiosk QR Code</h3>
                <p className="text-xs text-[#64677A]">Students scan this screen or physical printout</p>
              </div>
              <button
                onClick={() => setIsFullscreenModalOpen(true)}
                className="p-1.5 rounded-full hover:bg-[#F5F6FA] text-[#64677A] hover:text-[#141320] cursor-pointer"
                title="Fullscreen QR"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Gate Selector & After-Hours Toggle */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-[#64677A] block mb-1">
                  Active Gate Barrier
                </label>
                <select
                  value={activeGateName}
                  onChange={(e) => setGateName(e.target.value)}
                  className="w-full p-2 rounded-[10px] bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] font-medium outline-none"
                >
                  <option value="Main Gate 1">Main Gate 1</option>
                  <option value="Hostel Gate 2">Hostel Gate 2</option>
                  <option value="Academic Block">Academic Block</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#64677A] block mb-1">
                  Security Protocol
                </label>
                <button
                  type="button"
                  onClick={() => setGateAfterHoursMode(!isGateAfterHoursMode)}
                  className={`w-full p-2 rounded-[10px] font-medium border text-center transition-colors cursor-pointer ${
                    isGateAfterHoursMode
                      ? 'bg-[#2B2644] text-white border-[#2B2644]'
                      : 'bg-[#F5F6FA] text-[#64677A] border-[#2B2644]/12 hover:bg-[#E9ECF6]'
                  }`}
                >
                  {isGateAfterHoursMode ? 'After-Hours Mode' : 'Standard Mode'}
                </button>
              </div>
            </div>

            {/* Centered QR Display with Progress Ring */}
            <div className="bg-[#2B2644] rounded-[20px] p-6 text-white text-center flex flex-col items-center shadow-md">
              <div className="bg-white p-3 rounded-[16px] shadow-sm mb-3">
                <div
                  className="w-40 h-40 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: gateQrSvg }}
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-[#C9C7DA]">
                <Clock className="w-3.5 h-3.5" />
                <span>Refreshes in {qrSecondsLeft}s</span>
              </div>

              <div className="mt-3 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#C5CBE8] h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(qrSecondsLeft / 30) * 100}%` }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between w-full pt-3 border-t border-white/10 text-xs">
                <span className="font-mono text-[11px] text-[#C9C7DA]">{activeGateToken}</span>
                <button
                  onClick={handleCopyToken}
                  className="flex items-center gap-1 text-[11px] text-white hover:underline cursor-pointer"
                >
                  {copiedToken ? <Check className="w-3 h-3 text-[#C5CBE8]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* MODULE 2 (7 cols): SECURITY QR SCANNER & VERIFICATION */}
        <div className="lg:col-span-7 space-y-4">
          <Card variant="elevated" className="p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2B2644]/8">
              <div>
                <h3 className="text-sm font-bold text-[#141320]">Security Guard Scanner</h3>
                <p className="text-xs text-[#64677A]">Scan student phone passes at the gate post</p>
              </div>
              <Badge variant="purple">Guard Mode</Badge>
            </div>

            {/* Student Selector to Simulate Scan */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-[#64677A] block mb-1">
                  Select Student Phone Pass to Verify
                </label>
                <select
                  value={scannedStudentId}
                  onChange={(e) => setScannedStudentId(e.target.value)}
                  className="w-full text-xs p-3 rounded-[12px] bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] font-medium outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.department} (Year {s.year}) [{s.qrToken}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Verified Student Credentials Card */}
              <div className="p-4 rounded-[18px] bg-[#F5F6FA] border border-[#2B2644]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-[14px] bg-[#2B2644] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    {selectedStudent.avatarInitials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#141320]">{selectedStudent.name}</h4>
                    <p className="text-[11px] text-[#64677A]">{selectedStudent.department} · Year {selectedStudent.year}</p>
                    <span className="text-[10px] text-[#2B2644] font-mono mt-0.5 block">
                      Token: {selectedStudent.qrToken} · {studentActiveLog ? 'Status: INSIDE' : 'Status: OUTSIDE'}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#2B2644]/8">
                  <span className="text-[10px] font-bold uppercase text-[#64677A]">Identity Check</span>
                  <span className="text-xs font-bold text-[#2B2644] bg-white px-2.5 py-1 rounded-full border border-[#2B2644]/12">
                    Verified Scholar
                  </span>
                </div>
              </div>

              {/* Purpose & Destination for new entry */}
              {!studentActiveLog && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#64677A] block mb-1">
                      Purpose
                    </label>
                    <select
                      value={scanPurpose}
                      onChange={(e) => setScanPurpose(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-[10px] bg-[#F5F6FA] border border-[#2B2644]/12 outline-none font-medium"
                    >
                      {['Class', 'Library', 'Lab', 'Project work', 'Hostel', 'Event', 'Other'].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#64677A] block mb-1">
                      Destination
                    </label>
                    <input
                      type="text"
                      value={scanDestination}
                      onChange={(e) => setScanDestination(e.target.value)}
                      placeholder="e.g. Computing Lab"
                      className="w-full text-xs p-2.5 rounded-[10px] bg-[#F5F6FA] border border-[#2B2644]/12 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleApproveEntry}
                  disabled={!!studentActiveLog}
                  className="flex-1"
                  iconLeft={<CheckCircle2 className="w-4 h-4" />}
                >
                  Approve Entry ({activeGateName})
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleApproveExit}
                  disabled={!studentActiveLog}
                  className="flex-1"
                  iconLeft={<LogOut className="w-4 h-4" />}
                >
                  Approve Exit & Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* MODULE 3: LIVE GATE LOG TABLE & AUDIT */}
      <div className="bg-white rounded-[24px] p-6 border border-[#2B2644]/8 shadow-[0_8px_30px_rgba(43,38,68,0.05)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B2644]/8">
          <div>
            <h3 className="text-base font-bold text-[#141320]">Live Turnstile Access Ledger</h3>
            <p className="text-xs text-[#64677A]">Auditable log of campus arrivals and departures</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {(
              [
                { id: 'all', label: 'All Records' },
                { id: 'inside', label: 'On Campus' },
                { id: 'outside', label: 'Departed' },
                { id: 'afterhours', label: 'After-Hours' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterMode(tab.id)}
                className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors cursor-pointer ${
                  filterMode === tab.id
                    ? 'bg-[#2B2644] text-white'
                    : 'bg-[#F5F6FA] text-[#64677A] hover:bg-[#E9ECF6]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#64677A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, department, gate, or destination..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-[12px] bg-[#F5F6FA] border border-[#2B2644]/10 text-[#141320] outline-none"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#64677A]">
              No access logs match the selected filter.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#2B2644]/8 text-[#64677A]">
                  <th className="py-3 px-3 font-semibold uppercase text-[10px]">Student Scholar</th>
                  <th className="py-3 px-3 font-semibold uppercase text-[10px]">Purpose & Dest</th>
                  <th className="py-3 px-3 font-semibold uppercase text-[10px]">Gate Post</th>
                  <th className="py-3 px-3 font-semibold uppercase text-[10px]">Entry Check-In</th>
                  <th className="py-3 px-3 font-semibold uppercase text-[10px]">Exit Time</th>
                  <th className="py-3 px-3 font-semibold uppercase text-[10px] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B2644]/6">
                {filteredLogs.map((log) => {
                  const isInside = log.exitTime === null
                  return (
                    <tr key={log.id} className="hover:bg-[#F5F6FA]/60 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-[#141320]">{log.studentName}</div>
                        <div className="text-[10px] text-[#64677A]">{log.department}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-medium text-[#141320] block">{log.purpose}</span>
                        <span className="text-[10px] text-[#64677A] block truncate max-w-[150px]">{log.destination}</span>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-[#2B2644]">
                        {log.gateName || 'Main Gate 1'}
                        {log.isAfterHours && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#2B2644]/10 text-[#2B2644]">
                            Late
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-[#64677A]">
                        {new Date(log.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        <span className="block text-[10px] text-[#64677A]/70">{relativeTime(log.entryTime)}</span>
                      </td>
                      <td className="py-3.5 px-3 text-[#64677A]">
                        {log.exitTime
                          ? new Date(log.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {isInside ? (
                          <span className="inline-block px-2.5 py-1 text-[10px] font-semibold bg-[#2B2644] text-white rounded-full">
                            On Campus
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-1 text-[10px] font-semibold bg-[#F5F6FA] text-[#64677A] rounded-full border border-[#2B2644]/10">
                            Departed
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* FULLSCREEN GATE QR MODAL */}
      <Modal
        isOpen={isFullscreenModalOpen}
        onClose={() => setIsFullscreenModalOpen(false)}
        title={`${activeGateName} — Turnstile QR Kiosk`}
        description="Display this on the security post monitor for arriving scholars to scan."
      >
        <div className="text-center py-4 space-y-4">
          <div className="mx-auto w-64 h-64 bg-white p-4 rounded-[20px] shadow-lg border border-[#2B2644]/10 flex items-center justify-center">
            <div
              className="w-56 h-56 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: gateQrSvg }}
            />
          </div>

          <div className="space-y-1">
            <span className="text-xs text-[#64677A] block">Current Access Token (30s Turnover)</span>
            <span className="text-base font-mono font-bold text-[#2B2644] block">{activeGateToken}</span>
          </div>

          <div className="flex justify-center gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleCopyToken}>
              {copiedToken ? 'Token Copied!' : 'Copy Token'}
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsFullscreenModalOpen(false)}>
              Close Kiosk
            </Button>
          </div>
        </div>
      </Modal>

      {/* VISITOR PASS MODAL */}
      <Modal
        isOpen={isVisitorModalOpen}
        onClose={() => setIsVisitorModalOpen(false)}
        title="Issue Temporary Visitor Pass"
        description="Register a non-campus visitor accompanied by a student host."
      >
        <form onSubmit={handleCreateVisitor} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
              Visitor Full Name
            </label>
            <input
              type="text"
              required
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              className="w-full text-xs p-3 rounded-[12px] bg-[#F5F6FA] border border-[#2B2644]/12 outline-none"
              placeholder="e.g. Ramesh Kumar"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={visitorPhone}
              onChange={(e) => setVisitorPhone(e.target.value)}
              className="w-full text-xs p-3 rounded-[12px] bg-[#F5F6FA] border border-[#2B2644]/12 outline-none"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
              Host Student
            </label>
            <select
              value={visitorHostId}
              onChange={(e) => setVisitorHostId(e.target.value)}
              className="w-full text-xs p-3 rounded-[12px] bg-[#F5F6FA] border border-[#2B2644]/12 outline-none font-medium"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
              Visit Purpose
            </label>
            <input
              type="text"
              value={visitorPurpose}
              onChange={(e) => setVisitorPurpose(e.target.value)}
              className="w-full text-xs p-3 rounded-[12px] bg-[#F5F6FA] border border-[#2B2644]/12 outline-none"
              placeholder="e.g. Project presentation, Parent visit"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="md" onClick={() => setIsVisitorModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Generate Visitor Pass
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
