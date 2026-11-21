import React, { useState } from 'react'
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
} from 'lucide-react'
import { useStore } from '@/data/store'
import { formatDuration, relativeTime } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

export default function AdminGate() {
  const { gateLogs, students, visitors, logEntry, logExit, addVisitor } = useStore()
  const { success, info } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterPurpose, setFilterPurpose] = useState('all')

  // Simulate Scan State
  const [simStudentId, setSimStudentId] = useState(students[0]?.id || '')
  const [simPurpose, setSimPurpose] = useState('Lab')
  const [simDestination, setSimDestination] = useState('Innovation Hub')

  // Visitor Pass Modal State
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false)
  const [visitorName, setVisitorName] = useState('')
  const [visitorPhone, setVisitorPhone] = useState('')
  const [visitorPurpose, setVisitorPurpose] = useState('Parent visit')
  const [visitorHostId, setVisitorHostId] = useState(students[0]?.id || '')

  // Currently inside on campus
  const currentlyInside = gateLogs.filter((l) => l.exitTime === null)

  const filteredInside = currentlyInside.filter((l) => {
    if (filterPurpose !== 'all' && l.purpose !== filterPurpose) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        l.studentName.toLowerCase().includes(q) ||
        l.department.toLowerCase().includes(q) ||
        l.destination.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleSimulateScan = (e: React.FormEvent) => {
    e.preventDefault()
    logEntry(simStudentId, simPurpose, simDestination)
    const stu = students.find((s) => s.id === simStudentId)
    success(`Simulated scan: ${stu?.name} entered for ${simPurpose}`)
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
    const headers = ['ID,Student,Department,Purpose,Destination,EntryTime,ExitTime\n']
    const rows = gateLogs.map(
      (l) =>
        `"${l.id}","${l.studentName}","${l.department}","${l.purpose}","${l.destination}","${new Date(
          l.entryTime
        ).toISOString()}","${l.exitTime ? new Date(l.exitTime).toISOString() : 'ACTIVE'}"\n`
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

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider">
              Security Gate Desk
            </span>
            <Badge variant="purple">DEMO DATA</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight mt-1">
            Gate Occupancy & Access Log
          </h1>
          <p className="text-xs sm:text-sm text-[#64677A] mt-1">
            Real-time automated headcounts, visitor passes, and security scan simulations.
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

      {/* 8.3 Hero Widget: Currently on Campus Counter */}
      <Card
        variant="dark"
        className="p-8 sm:p-10 relative overflow-hidden bg-gradient-to-r from-[#2B2644] to-[#11101D]"
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs uppercase tracking-wider text-[#C9C7DA] font-semibold">
                Live Campus Occupancy
              </span>
            </div>
            <div className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
              {currentlyInside.length}{' '}
              <span className="text-xl font-normal text-[#C9C7DA]">Students on campus</span>
            </div>
            <p className="text-xs text-[#C9C7DA] mt-2">
              Synchronized with Turnstile Gate 1 & Gate 2 automated QR sensors.
            </p>
          </div>

          <div className="flex flex-col gap-1 text-right sm:border-l sm:border-white/10 sm:pl-8">
            <span className="text-xs text-[#C9C7DA]">Total Visits Today</span>
            <span className="text-2xl font-bold text-white">{gateLogs.length}</span>
            <span className="text-[11px] text-emerald-400">Zero register logbook queues</span>
          </div>
        </div>
      </Card>

      {/* Grid: Simulate Scan Widget + Visitor Passes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulate Scan Panel (1-col) */}
        <Card variant="elevated" className="p-6">
          <h3 className="text-sm font-bold text-[#141320] mb-1">Simulate Gate Scan</h3>
          <p className="text-xs text-[#64677A] mb-4">
            Simulate a student scanning at the gate without switching screens.
          </p>

          <form onSubmit={handleSimulateScan} className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#64677A] block mb-1">
                Student
              </label>
              <select
                value={simStudentId}
                onChange={(e) => setSimStudentId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-[12px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.1)] outline-none"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#64677A] block mb-1">
                Purpose
              </label>
              <select
                value={simPurpose}
                onChange={(e) => setSimPurpose(e.target.value)}
                className="w-full text-xs p-2.5 rounded-[12px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.1)] outline-none"
              >
                {['Class', 'Library', 'Lab', 'Project work', 'Hostel', 'Event', 'Other'].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#64677A] block mb-1">
                Destination
              </label>
              <input
                type="text"
                value={simDestination}
                onChange={(e) => setSimDestination(e.target.value)}
                className="w-full text-xs p-2.5 rounded-[12px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.1)] outline-none"
                placeholder="e.g. Main Academic Block"
              />
            </div>

            <Button variant="primary" size="sm" type="submit" className="w-full mt-2">
              Record Gate Entry
            </Button>
          </form>
        </Card>

        {/* Active Visitors Sub-panel (2-cols) */}
        <Card variant="elevated" className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#141320]">Issued Visitor Passes</h3>
                <p className="text-xs text-[#64677A]">Temporary passes linked to student hosts</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVisitorModalOpen(true)}
                iconLeft={<Plus className="w-3.5 h-3.5" />}
              >
                New Pass
              </Button>
            </div>

            <div className="space-y-3">
              {visitors.map((v) => (
                <div
                  key={v.id}
                  className="p-3 rounded-[14px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.06)] flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-semibold text-[#141320]">{v.name}</h4>
                    <p className="text-[11px] text-[#64677A]">
                      Host: {v.hostStudentName} · Ph: {v.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="purple">{v.purpose}</Badge>
                    <span className="text-[10px] text-[#64677A] block mt-1">
                      Valid until {new Date(v.validUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-[#64677A] mt-4 pt-3 border-t border-[rgba(43,38,68,0.06)]">
            Visitor passes automatically expire at 10:00 PM per campus regulations.
          </p>
        </Card>
      </div>

      {/* Currently on Campus Live List */}
      <Card variant="elevated" className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-[#141320]">
              Students Currently Inside Campus ({filteredInside.length})
            </h3>
            <p className="text-xs text-[#64677A]">
              Live security roster. Amber badges highlight visits exceeding 8 hours.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#64677A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or dept..."
                className="h-9 pl-9 pr-3 text-xs rounded-full bg-[#F5F6FA] border border-[rgba(43,38,68,0.08)] outline-none"
              />
            </div>

            <select
              value={filterPurpose}
              onChange={(e) => setFilterPurpose(e.target.value)}
              className="h-9 px-3 text-xs rounded-full bg-[#F5F6FA] border border-[rgba(43,38,68,0.08)] outline-none"
            >
              <option value="all">All Purposes</option>
              <option value="Class">Class</option>
              <option value="Library">Library</option>
              <option value="Lab">Lab</option>
              <option value="Project work">Project work</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F6FA] border-b border-[rgba(43,38,68,0.08)] text-[#64677A] uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Entry Time</th>
                <th className="py-3 px-4">Stay Duration</th>
                <th className="py-3 px-4 text-right">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(43,38,68,0.06)]">
              {filteredInside.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#64677A]">
                    No students currently logged inside campus matching filters.
                  </td>
                </tr>
              ) : (
                filteredInside.map((log) => {
                  const durationMs = Date.now() - log.entryTime
                  const isLongStay = durationMs > 8 * 3600000 // > 8 hours amber flag

                  return (
                    <tr key={log.id} className="hover:bg-[#F5F6FA]/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#141320]">
                        {log.studentName}
                      </td>
                      <td className="py-3.5 px-4 text-[#64677A]">{log.department}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant="purple">{log.purpose}</Badge>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#141320]">{log.destination}</td>
                      <td className="py-3.5 px-4 text-[#64677A]">
                        {new Date(log.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`font-mono ${isLongStay ? 'text-amber-600 font-bold' : 'text-[#2B2644]'}`}>
                          {formatDuration(durationMs)}
                        </span>
                        {isLongStay && (
                          <span className="block text-[10px] text-amber-600 font-semibold">
                            ⚠️ Long stay (&gt;8h)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            logExit(log.id)
                            success(`Logged departure for ${log.studentName}`)
                          }}
                        >
                          Log Exit
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Visitor Pass Modal */}
      <Modal
        isOpen={isVisitorModalOpen}
        onClose={() => setIsVisitorModalOpen(false)}
        title="Issue Guest / Visitor Pass"
        description="Record guest entry details and assign a student host for campus security protocol."
      >
        <form onSubmit={handleCreateVisitor} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#64677A] uppercase block mb-1">Guest Full Name</label>
            <input
              type="text"
              required
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              className="w-full h-11 px-4 text-xs rounded-[14px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.1)] outline-none"
              placeholder="e.g. Ramesh Kumar"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#64677A] uppercase block mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={visitorPhone}
              onChange={(e) => setVisitorPhone(e.target.value)}
              className="w-full h-11 px-4 text-xs rounded-[14px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.1)] outline-none"
              placeholder="e.g. 9876543210"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#64677A] uppercase block mb-1">Purpose of Visit</label>
            <select
              value={visitorPurpose}
              onChange={(e) => setVisitorPurpose(e.target.value)}
              className="w-full h-11 px-4 text-xs rounded-[14px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.1)] outline-none"
            >
              <option value="Parent visit">Parent visit</option>
              <option value="Guest lecture">Guest lecture</option>
              <option value="Official vendor">Official vendor / delivery</option>
              <option value="Campus tour">Campus tour</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#64677A] uppercase block mb-1">Host Student</label>
            <select
              value={visitorHostId}
              onChange={(e) => setVisitorHostId(e.target.value)}
              className="w-full h-11 px-4 text-xs rounded-[14px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.1)] outline-none"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.department})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" size="md" type="button" onClick={() => setIsVisitorModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Issue Pass
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
