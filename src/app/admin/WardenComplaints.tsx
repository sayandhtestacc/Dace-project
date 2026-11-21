import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  User,
  ArrowRight,
  ShieldAlert,
  Send,
  Download,
  AlertCircle,
  TrendingUp,
  RotateCw,
  Home,
  Check,
} from 'lucide-react'
import { useStore } from '@/data/store'
import type { ComplaintCategory, ComplaintStatus } from '@/data/types'
import { relativeTime, formatDuration } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { Modal } from '@/components/ui/Modal'

export default function WardenComplaints() {
  const { complaints, students, updateComplaintStatus, addComplaintComment } = useStore()
  const { success, info, warning } = useToast()
  const [searchParams] = useSearchParams()

  const initialCat = (searchParams.get('category') as ComplaintCategory) || 'all'

  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'urgent' | 'hostel' | 'overdue'>('all')
  const [deptFilter, setDeptFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCat)

  // Escalation notice modal
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null)
  const [escalationNote, setEscalationNote] = useState<string>('')
  const [targetDeptHead, setTargetDeptHead] = useState<string>('IT Department Head')

  const departments = ['IT Department', 'Maintenance', 'Academic Office', 'AV Department', 'Mess Committee']

  const slaTargetMs = 24 * 3600 * 1000

  // Filter complaints
  const filtered = complaints.filter((c) => {
    const remainingMs = c.createdAt + slaTargetMs - Date.now()
    const isOverdue = remainingMs <= 0 && c.status !== 'Resolved'

    if (activeTab === 'urgent' && c.priority !== 'Urgent') return false
    if (activeTab === 'hostel' && c.category !== 'Hostel') return false
    if (activeTab === 'overdue' && !isOverdue) return false

    if (deptFilter !== 'all' && c.assignedTo !== deptFilter) return false
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const stu = students.find((s) => s.id === c.studentId)
      return (
        c.title.toLowerCase().includes(q) ||
        c.refId.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (stu && stu.name.toLowerCase().includes(q))
      )
    }
    return true
  })

  // Executive Reassignment Override
  const handleWardenReassign = (id: string, newDept: string) => {
    updateComplaintStatus(id, 'Assigned', newDept)
    addComplaintComment(id, {
      author: 'Campus Warden Desk',
      authorRole: 'warden',
      content: `[EXECUTIVE DIRECTIVE] Reassigned to ${newDept} by Campus Warden for expedited clearance.`,
    })
    info(`Warden override: Reassigned to ${newDept}`)
  }

  // Issue Escalation Notice
  const handleSendEscalationNotice = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedComplaintId) return

    addComplaintComment(selectedComplaintId, {
      author: 'Office of the Warden',
      authorRole: 'warden',
      content: `[FORMAL ESCALATION NOTICE to ${targetDeptHead}]: ${escalationNote || 'This ticket has been escalated due to SLA violation and student welfare impact. Immediate resolution report required within 4 hours.'}`,
    })

    setSelectedComplaintId(null)
    setEscalationNote('')
    success('Warden Formal Escalation Notice Dispatched!')
  }

  // Quick Resolve
  const handleApproveResolution = (id: string) => {
    updateComplaintStatus(id, 'Resolved')
    addComplaintComment(id, {
      author: 'Campus Warden',
      authorRole: 'warden',
      content: 'Resolution confirmed and formally closed by Campus Warden.',
    })
    success('Complaint marked as Resolved by Executive Warden Order')
  }

  const urgentCount = complaints.filter((c) => c.priority === 'Urgent' && c.status !== 'Resolved').length
  const overdueCount = complaints.filter((c) => {
    const rem = c.createdAt + slaTargetMs - Date.now()
    return rem <= 0 && c.status !== 'Resolved'
  }).length
  const hostelCount = complaints.filter((c) => c.category === 'Hostel' && c.status !== 'Resolved').length

  return (
    <div className="space-y-6 pb-20">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider">
              Administration & Student Welfare
            </span>
            <Badge variant="purple">WARDEN EXECUTIVE OVERSIGHT</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight mt-1">
            Campus Grievance Escalation Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#64677A] mt-1">
            Executive oversight over all department response times, hostel safety incidents, and inter-departmental reassignment directives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/app/warden">
            <Button variant="outline" size="sm">
              Overview Dashboard
            </Button>
          </Link>
          <Badge variant="warning">{urgentCount} Urgent Escalations</Badge>
        </div>
      </div>

      {/* Warden Critical Escalation KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('urgent')}
          className={`p-4 rounded-[20px] border cursor-pointer transition-all ${
            activeTab === 'urgent'
              ? 'bg-[#2B2644] text-white border-[#2B2644] shadow-md'
              : 'bg-white border-[#2B2644]/8 hover:border-[#2B2644]/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'urgent' ? 'text-[#C5CBE8]' : 'text-[#64677A]'}`}>
              Urgent Priority
            </span>
            <AlertTriangle className={`w-4 h-4 ${activeTab === 'urgent' ? 'text-amber-300' : 'text-amber-600'}`} />
          </div>
          <div className="text-2xl font-bold">{urgentCount} Tickets</div>
          <p className={`text-[11px] mt-1 ${activeTab === 'urgent' ? 'text-white/80' : 'text-[#64677A]'}`}>
            Direct student impact requiring immediate review
          </p>
        </div>

        <div
          onClick={() => setActiveTab('overdue')}
          className={`p-4 rounded-[20px] border cursor-pointer transition-all ${
            activeTab === 'overdue'
              ? 'bg-[#2B2644] text-white border-[#2B2644] shadow-md'
              : 'bg-white border-[#2B2644]/8 hover:border-[#2B2644]/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'overdue' ? 'text-[#C5CBE8]' : 'text-[#64677A]'}`}>
              SLA Overdue (&gt;24h)
            </span>
            <Clock className={`w-4 h-4 ${activeTab === 'overdue' ? 'text-rose-300' : 'text-rose-600'}`} />
          </div>
          <div className="text-2xl font-bold">{overdueCount} Tickets</div>
          <p className={`text-[11px] mt-1 ${activeTab === 'overdue' ? 'text-white/80' : 'text-[#64677A]'}`}>
            Exceeded standard redressal turnaround window
          </p>
        </div>

        <div
          onClick={() => setActiveTab('hostel')}
          className={`p-4 rounded-[20px] border cursor-pointer transition-all ${
            activeTab === 'hostel'
              ? 'bg-[#2B2644] text-white border-[#2B2644] shadow-md'
              : 'bg-white border-[#2B2644]/8 hover:border-[#2B2644]/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'hostel' ? 'text-[#C5CBE8]' : 'text-[#64677A]'}`}>
              Hostel Welfare
            </span>
            <Home className={`w-4 h-4 ${activeTab === 'hostel' ? 'text-[#C5CBE8]' : 'text-[#2B2644]'}`} />
          </div>
          <div className="text-2xl font-bold">{hostelCount} Tickets</div>
          <p className={`text-[11px] mt-1 ${activeTab === 'hostel' ? 'text-white/80' : 'text-[#64677A]'}`}>
            Nila, Periyar, and residential block facilities
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="elevated" className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#64677A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by ref ID, student name, or issue title..."
              className="w-full h-10 pl-10 pr-4 text-xs rounded-full bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] outline-none"
            />
          </div>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded-full bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] outline-none"
          >
            <option value="all">All Assigned Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded-full bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Hostel">Hostel</option>
            <option value="Academic">Academic</option>
            <option value="Mess">Mess</option>
            <option value="Other">Other</option>
          </select>

          {activeTab !== 'all' && (
            <button
              onClick={() => setActiveTab('all')}
              className="px-3 py-2 text-xs font-medium text-[#2B2644] hover:underline cursor-pointer"
            >
              Clear Tab ({activeTab})
            </button>
          )}
        </div>
      </Card>

      {/* Executive Tickets Table */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F6FA] border-b border-[#2B2644]/8 text-[#64677A] uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Ref ID</th>
                <th className="py-3.5 px-4">Scholar Details</th>
                <th className="py-3.5 px-4">Issue Title & Scope</th>
                <th className="py-3.5 px-4">SLA Clock</th>
                <th className="py-3.5 px-4">Department Assignment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Warden Directive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B2644]/6">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#64677A]">
                    No grievances matching active escalation filters.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const stu = students.find((s) => s.id === c.studentId)
                  const remainingMs = c.createdAt + slaTargetMs - Date.now()
                  const isOverdue = remainingMs <= 0 && c.status !== 'Resolved'
                  const hoursRemaining = Math.max(0, Math.floor(remainingMs / (3600 * 1000)))
                  const hoursOverdue = Math.abs(Math.floor(remainingMs / (3600 * 1000)))

                  return (
                    <tr key={c.id} className="hover:bg-[#F5F6FA]/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#2B2644]">
                        {c.refId}
                      </td>

                      <td className="py-3.5 px-4">
                        {c.isAnonymous ? (
                          <span className="text-[#64677A] italic">🔒 Anonymous Scholar</span>
                        ) : (
                          <div>
                            <span className="font-semibold text-[#141320] block">{stu?.name || 'DUK Scholar'}</span>
                            <span className="text-[10px] text-[#64677A]">{stu?.school || 'SoCSE'} · {stu?.department}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-semibold bg-[#2B2644]/6 text-[#2B2644] px-1.5 py-0.2 rounded">
                            {c.category}
                          </span>
                          <span className="text-[10px] text-[#64677A]">{relativeTime(c.createdAt)}</span>
                        </div>
                        <span className="font-semibold text-[#141320] line-clamp-1 block">{c.title}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        {c.status === 'Resolved' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF6F3] text-[#1E6B52]">
                            Resolved
                          </span>
                        ) : isOverdue ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FBF0F2] text-[#9E2A3B] border border-[#9E2A3B]/20 animate-pulse">
                            Overdue ({hoursOverdue}h)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F2FA] text-[#2B2644]">
                            {hoursRemaining}h remaining
                          </span>
                        )}
                      </td>

                      {/* Executive Department Reassignment */}
                      <td className="py-3.5 px-4">
                        <select
                          value={c.assignedTo || ''}
                          onChange={(e) => handleWardenReassign(c.id, e.target.value)}
                          className="text-xs p-1.5 rounded-[8px] bg-[#F5F6FA] border border-[#2B2644]/12 font-medium text-[#141320] outline-none"
                          title="Override Department Assignment"
                        >
                          <option value="">Unassigned</option>
                          {departments.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant={c.status === 'Resolved' ? 'success' : c.status === 'In Progress' ? 'purple' : 'warning'}>
                          {c.status}
                        </Badge>
                      </td>

                      {/* Warden Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedComplaintId(c.id)
                              setTargetDeptHead(`${c.assignedTo || 'Department'} Head`)
                            }}
                            className="p-1.5 rounded-[8px] hover:bg-rose-50 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                            title="Issue Warden Formal Escalation"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>

                          {c.status !== 'Resolved' && (
                            <button
                              type="button"
                              onClick={() => handleApproveResolution(c.id)}
                              className="p-1.5 rounded-[8px] hover:bg-emerald-50 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                              title="Warden Direct Resolve"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          )}

                          <Link
                            to={`/app/complaints/${c.id}`}
                            className="p-1.5 rounded-[8px] hover:bg-[#F5F6FA] text-[#2B2644] border border-[#2B2644]/12 transition-colors inline-block"
                            title="Inspect Timeline & Thread"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Escalation Notice Modal */}
      <Modal
        isOpen={Boolean(selectedComplaintId)}
        onClose={() => setSelectedComplaintId(null)}
        title="Issue Warden Executive Escalation Notice"
      >
        <form onSubmit={handleSendEscalationNotice} className="space-y-4">
          <p className="text-xs text-[#64677A]">
            This directive will be dispatched with top priority to the department head and recorded in the official audit trail.
          </p>

          <div>
            <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
              Escalate To
            </label>
            <input
              type="text"
              value={targetDeptHead}
              onChange={(e) => setTargetDeptHead(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
              Warden Executive Note
            </label>
            <textarea
              rows={3}
              value={escalationNote}
              onChange={(e) => setEscalationNote(e.target.value)}
              placeholder="e.g. Immediate resolution required. Repeated issue reported in Nila Block A..."
              className="w-full p-3 text-xs rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 outline-none focus:border-[#2B2644]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedComplaintId(null)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              iconRight={<Send className="w-3.5 h-3.5" />}
              className="bg-rose-700 hover:bg-rose-800"
            >
              Dispatch Escalation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
