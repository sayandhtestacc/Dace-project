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
} from 'lucide-react'
import { useStore } from '@/data/store'
import type { ComplaintCategory, ComplaintStatus } from '@/data/types'
import { relativeTime } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export default function AdminComplaints() {
  const { complaints, students, updateComplaintStatus } = useStore()
  const { success, info } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const departments = ['IT Department', 'Maintenance', 'Academic Office', 'AV Department', 'Mess Committee']

  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        c.title.toLowerCase().includes(q) ||
        c.refId.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleStatusChange = (id: string, newStatus: ComplaintStatus) => {
    updateComplaintStatus(id, newStatus)
    success(`Status updated to ${newStatus}`)
  }

  const handleAssignChange = (id: string, dept: string) => {
    updateComplaintStatus(id, 'Assigned', dept)
    info(`Assigned to ${dept}`)
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
            Department Admin Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight">
            Complaint Redressal Inbox
          </h1>
          <p className="text-xs sm:text-sm text-[#64677A] mt-1">
            Assign tickets to maintenance engineers, monitor resolution SLAs, and mark tickets resolved.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple">{complaints.length} Total Tickets</Badge>
          <Badge variant="warning">
            {complaints.filter((c) => c.status === 'In Progress').length} In Progress
          </Badge>
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
              placeholder="Search by ticket ID or title..."
              className="w-full h-10 pl-10 pr-4 text-xs rounded-full bg-[#F5F6FA] border border-[rgba(43,38,68,0.08)] text-[#141320] outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded-full bg-[#F5F6FA] border border-[rgba(43,38,68,0.08)] text-[#141320] outline-none"
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
            className="h-10 px-3 text-xs rounded-full bg-[#F5F6FA] border border-[rgba(43,38,68,0.08)] text-[#141320] outline-none"
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
            <thead className="bg-[#F5F6FA] border-b border-[rgba(43,38,68,0.08)] text-[#64677A] uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Ref ID</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Issue Title</th>
                <th className="py-3 px-4">Priority & SLA</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">Status Changer</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(43,38,68,0.06)]">
              {filtered.map((c) => {
                const stu = students.find((s) => s.id === c.studentId)
                const slaTargetMs = 24 * 3600 * 1000
                const remainingMs = c.createdAt + slaTargetMs - Date.now()
                const isOverdue = remainingMs <= 0
                const hoursRemaining = Math.max(0, Math.floor(remainingMs / (3600 * 1000)))
                const hoursOverdue = Math.abs(Math.floor(remainingMs / (3600 * 1000)))

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
                      <span className="px-2 py-0.5 rounded-full bg-[#F5F6FA] text-[#2B2644] font-medium border border-[rgba(43,38,68,0.08)]">
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

                    {/* Assignee Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={c.assignedTo || ''}
                        onChange={(e) => handleAssignChange(c.id, e.target.value)}
                        className="text-xs p-1.5 rounded-[8px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.1)] outline-none"
                      >
                        <option value="">Unassigned</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Inline Status Changer */}
                    <td className="py-3.5 px-4">
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value as ComplaintStatus)}
                        className="text-xs p-1.5 rounded-[8px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.1)] font-semibold text-[#2B2644] outline-none"
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
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
