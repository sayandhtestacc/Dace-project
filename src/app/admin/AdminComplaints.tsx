import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  User,
  ArrowRight,
  ShieldCheck,
  Wrench,
  UserCheck,
} from 'lucide-react'
import { useStore } from '@/data/store'
import type { ComplaintCategory, ComplaintStatus } from '@/data/types'
import { relativeTime } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export default function AdminComplaints() {
  const { complaints, students, updateComplaintStatus, addComplaintComment } = useStore()
  const { success, info } = useToast()

  const [activeDept, setActiveDept] = useState<string>('IT Department')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const departments = ['IT Department', 'Maintenance', 'Academic Office', 'AV Department', 'Mess Committee']

  // Technicians mock roster for dispatch
  const technicians: Record<string, string[]> = {
    'IT Department': ['Sunil V. (Network Admin)', 'Kiran Das (Hardware Lead)', 'Reji P. (Cloud/Portal)'],
    'Maintenance': ['Manoj K. (Chief Electrician)', 'Saji R. (Plumbing Lead)', 'Biju T. (Civil/HVAC)'],
    'Academic Office': ['Dr. Rekha (Registrar Desk)', 'Praveen S. (Timetable Coord)'],
    'AV Department': ['Deepak M. (Audiovisual Tech)', 'Aneesh (Lab Support)'],
    'Mess Committee': ['K. Raman (Catering Supervisor)', 'Sujith (Inspection Staff)'],
  }

  const filtered = complaints.filter((c) => {
    // Dept filter if not "all"
    if (activeDept !== 'all' && c.assignedTo !== activeDept) return false

    if (statusFilter !== 'all' && c.status !== statusFilter) return false
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

  const handleStatusChange = (id: string, newStatus: ComplaintStatus) => {
    updateComplaintStatus(id, newStatus)
    addComplaintComment(id, {
      author: `${activeDept} Staff`,
      authorRole: 'admin',
      content: `Status updated to ${newStatus} by ${activeDept} team.`,
    })
    success(`Status updated to ${newStatus}`)
  }

  const handleAssignChange = (id: string, dept: string) => {
    updateComplaintStatus(id, 'Assigned', dept)
    info(`Assigned to ${dept}`)
  }

  const handleDispatchTech = (id: string, techName: string) => {
    addComplaintComment(id, {
      author: `${activeDept} Dispatch`,
      authorRole: 'admin',
      content: `Technician assigned: ${techName}. On-site inspection initiated.`,
    })
    updateComplaintStatus(id, 'In Progress')
    success(`Dispatched ${techName} to ticket`)
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider">
              Operations & Field Redressal
            </span>
            <Badge variant="purple">STAFF WORKSPACE</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight mt-1">
            Department Operations Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#64677A] mt-1">
            Dispatch technicians, log work progress notes, and clear service tickets within the 24h SLA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple">{complaints.length} University Tickets</Badge>
          <Badge variant="warning">
            {complaints.filter((c) => c.status === 'In Progress').length} In Progress
          </Badge>
        </div>
      </div>

      {/* Department Selector Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#2B2644]/8 shadow-xs flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold text-[#64677A] uppercase tracking-wider px-2 shrink-0">
          My Operational Unit:
        </span>
        {departments.map((dept) => {
          const isSelected = activeDept === dept
          const count = complaints.filter((c) => c.assignedTo === dept && c.status !== 'Resolved').length
          return (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#2B2644] text-white shadow-xs'
                  : 'bg-[#F5F6FA] text-[#64677A] hover:bg-[#E9ECF6] hover:text-[#141320]'
              }`}
            >
              <span>{dept}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-white text-[#2B2644]' : 'bg-[#2B2644]/10 text-[#2B2644]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
        <button
          onClick={() => setActiveDept('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            activeDept === 'all'
              ? 'bg-[#2B2644] text-white shadow-xs'
              : 'bg-[#F5F6FA] text-[#64677A] hover:bg-[#E9ECF6]'
          }`}
        >
          View All Departments
        </button>
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
              placeholder="Search by ticket ID, title, or student name..."
              className="w-full h-10 pl-10 pr-4 text-xs rounded-full bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded-full bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Reopened">Reopened</option>
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
        </div>
      </Card>

      {/* Tickets Table */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F6FA] border-b border-[#2B2644]/8 text-[#64677A] uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Ref ID</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Issue Title</th>
                <th className="py-3 px-4">Priority & SLA</th>
                <th className="py-3 px-4">Technician Dispatch</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B2644]/6">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#64677A]">
                    No service tickets found in {activeDept === 'all' ? 'any unit' : activeDept}.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const stu = students.find((s) => s.id === c.studentId)
                  const slaTargetMs = 24 * 3600 * 1000
                  const remainingMs = c.createdAt + slaTargetMs - Date.now()
                  const isOverdue = remainingMs <= 0 && c.status !== 'Resolved'
                  const hoursRemaining = Math.max(0, Math.floor(remainingMs / (3600 * 1000)))
                  const hoursOverdue = Math.abs(Math.floor(remainingMs / (3600 * 1000)))

                  const currentTechRoster = technicians[c.assignedTo || activeDept] || technicians['IT Department']

                  return (
                    <tr key={c.id} className="hover:bg-[#F5F6FA]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-[#2B2644]">
                        {c.refId}
                      </td>

                      <td className="py-3.5 px-4">
                        {c.isAnonymous ? (
                          <span className="text-[#64677A] italic">🔒 Anonymous</span>
                        ) : (
                          <div>
                            <span className="font-semibold text-[#141320] block">{stu?.name}</span>
                            <span className="text-[10px] text-[#64677A]">{stu?.department}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-[#F5F6FA] text-[#2B2644] font-medium border border-[#2B2644]/8">
                          {c.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-semibold text-[#141320] line-clamp-1">{c.title}</span>
                        <span className="text-[10px] text-[#64677A]">{relativeTime(c.createdAt)}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <Badge variant={c.priority === 'Urgent' ? 'error' : 'neutral'}>
                            {c.priority}
                          </Badge>
                          {c.status === 'Resolved' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF6F3] text-[#1E6B52]">
                              SLA Met
                            </span>
                          ) : isOverdue ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FBF0F2] text-[#9E2A3B] border border-[#9E2A3B]/20">
                              Overdue ({hoursOverdue}h)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F2FA] text-[#2B2644]">
                              {hoursRemaining}h SLA
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Technician Quick Dispatch */}
                      <td className="py-3.5 px-4">
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) handleDispatchTech(c.id, e.target.value)
                          }}
                          className="text-xs p-1.5 rounded-[8px] bg-[#F5F6FA] border border-[#2B2644]/12 outline-none"
                        >
                          <option value="">Dispatch Tech...</option>
                          {currentTechRoster.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Inline Status Changer */}
                      <td className="py-3.5 px-4">
                        <select
                          value={c.status}
                          onChange={(e) => handleStatusChange(c.id, e.target.value as ComplaintStatus)}
                          className="text-xs p-1.5 rounded-[8px] bg-[#F5F6FA] border border-[#2B2644]/12 font-semibold text-[#2B2644] outline-none"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Reopened">Reopened</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/app/complaints/${c.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2B2644] hover:underline"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
