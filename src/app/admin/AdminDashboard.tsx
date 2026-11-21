import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  Utensils,
  Shield,
  Clock,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  Download,
  AlertTriangle,
  Moon,
  Sparkles,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts'
import { useStore } from '@/data/store'
import { relativeTime, formatINR } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export default function AdminDashboard() {
  const { complaints, students, mealBookings, gateLogs, notifications } = useStore()
  const { success } = useToast()

  // KPIs
  const openComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length
  const todayStr = new Date().toISOString().split('T')[0]
  const todayBookingsCount = mealBookings.filter((b) => b.date === todayStr && b.status === 'booked').length
  const currentlyOnCampusCount = gateLogs.filter((l) => l.exitTime === null).length
  const afterHoursLogs = gateLogs.filter((l) => l.isAfterHours)

  // Category breakdown for horizontal bar chart
  const categories = ['Technical', 'Hostel', 'Academic', 'Mess', 'Other']
  const totalComplaints = complaints.length || 1
  const categoryData = categories.map((cat) => {
    const count = complaints.filter((c) => c.category === cat).length
    return {
      name: cat,
      count,
      percent: Math.round((count / totalComplaints) * 100),
    }
  })

  // Meals Last 7 Days for Bar Chart
  const last7DaysData = [
    { day: 'Mon', booked: 180, served: 165 },
    { day: 'Tue', booked: 195, served: 182 },
    { day: 'Wed', booked: 210, served: 198 },
    { day: 'Thu', booked: 205, served: 190 },
    { day: 'Fri', booked: 220, served: 204 },
    { day: 'Sat', booked: 140, served: 130 },
    { day: 'Sun', booked: 160, served: 148 },
  ]

  // After-Hours hourly sparkline (18:00 to 08:00)
  const afterHoursHourlyData = [
    { hour: '18:00', entries: 4 },
    { hour: '20:00', entries: 7 },
    { hour: '22:00', entries: 9 },
    { hour: '00:00', entries: 3 },
    { hour: '02:00', entries: 2 },
    { hour: '04:00', entries: 1 },
    { hour: '06:00', entries: 5 },
  ]

  // CSV Export for Warden
  const handleExportGateCSV = () => {
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
    success('Exported gate access log (.CSV)')
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider">
              Administration & Analytics
            </span>
            <Badge variant="purple">WARDEN DESK</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight mt-1">
            Campus Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#64677A] mt-1">
            Consolidated intelligence across grievance resolution, mess quota efficiency, and after-hours security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportGateCSV}
            iconLeft={<Download className="w-3.5 h-3.5" />}
          >
            Export Gate Log (CSV)
          </Button>
          <Link to="/app/warden/complaints">
            <Button variant="primary" size="sm">
              Manage Complaints
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <Link to="/app/warden/complaints" className="block group">
          <Card variant="elevated" className="p-5 h-full transition-all group-hover:-translate-y-0.5 group-hover:border-[#2B2644]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#64677A] uppercase group-hover:text-[#2B2644]">Active Complaints</span>
              <span className="p-2 rounded-full bg-[#F0F2FA] text-[#2B2644]">
                <AlertCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-bold text-[#141320] group-hover:text-[#2B2644]">{openComplaintsCount}</div>
            <p className="text-[11px] text-[#64677A] mt-2 flex items-center justify-between">
              <span>{resolvedCount} resolved</span>
              <span className="text-[#2B2644] font-semibold">Inspect →</span>
            </p>
          </Card>
        </Link>

        <Card variant="elevated" className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#64677A] uppercase">Avg Resolution Time</span>
            <span className="p-2 rounded-full bg-[#F0F2FA] text-[#2B2644]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-bold text-[#2B2644]">14.2h</div>
          <p className="text-[11px] text-[#2B2644] font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 24h SLA compliance 96%
          </p>
        </Card>

        <Card variant="elevated" className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#64677A] uppercase">Today's Meals Booked</span>
            <span className="p-2 rounded-full bg-[#F0F2FA] text-[#2B2644]">
              <Utensils className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-bold text-[#141320]">{todayBookingsCount || 142}</div>
          <p className="text-[11px] text-[#64677A] mt-2">
            Kitchen quota lock at 8:00 PM
          </p>
        </Card>

        <Card variant="elevated" className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#64677A] uppercase">After-Hours Events</span>
            <span className="p-2 rounded-full bg-[#F0F2FA] text-[#2B2644]">
              <Moon className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-bold text-[#2B2644] flex items-center gap-2">
            <span>{afterHoursLogs.length}</span>
          </div>
          <p className="text-[11px] text-[#64677A] mt-2">
            6:00 PM – 8:00 AM late entries
          </p>
        </Card>
      </div>

      {/* AFTER-HOURS MONITOR HIGHLIGHT CARD */}
      <Card variant="elevated" className="p-6 border-l-4 border-l-[#2B2644]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B2644]/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#2B2644] text-white flex items-center justify-center">
              <Moon className="w-5 h-5 text-[#C5CBE8]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#141320]">Warden's After-Hours Security Radar</h3>
              <p className="text-xs text-[#64677A]">Automated audit trail of students entering or departing during night hours</p>
            </div>
          </div>
          <Badge variant="purple">{afterHoursLogs.length} Escalations Recorded</Badge>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {afterHoursLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="p-3.5 rounded-[14px] bg-[#F5F6FA] border border-[#2B2644]/8 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#141320]">{log.studentName}</span>
                <span className="text-[10px] text-[#64677A] font-mono">
                  {new Date(log.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[11px] text-[#64677A] truncate">
                {log.department} · {log.destination}
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px]">
                <span className="text-[#2B2644] font-semibold">{log.gateName || 'Main Gate 1'}</span>
                <span className="px-1.5 py-0.5 rounded bg-white text-[#2B2644] border border-[#2B2644]/10">
                  {log.purpose}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Analytics Charts Grid: Horizontal Complaints Breakdown + After-Hours Hourly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Complaints by Category Horizontal Breakdown */}
        <Card variant="elevated" className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#141320]">Complaints by Category</h3>
                <p className="text-xs text-[#64677A]">Horizontal volume breakdown across administrative units</p>
              </div>
              <Badge variant="purple">Category Share</Badge>
            </div>

            <div className="space-y-4 pt-2">
              {categoryData.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/app/warden/complaints?category=${cat.name}`}
                  className="block space-y-1.5 group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#141320] group-hover:text-[#2B2644] group-hover:underline">
                      {cat.name}
                    </span>
                    <span className="text-[#64677A]">
                      {cat.count} tickets <span className="text-[#2B2644] font-bold">({cat.percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#F5F6FA] rounded-full h-2.5 overflow-hidden border border-[#2B2644]/6">
                    <div
                      className="bg-[#2B2644] h-full rounded-full transition-all duration-500 group-hover:bg-[#11101D]"
                      style={{ width: `${Math.max(8, cat.percent)}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#2B2644]/8 text-xs text-[#64677A] flex items-center justify-between mt-4">
            <span>Resolution Target: &lt; 24h</span>
            <Link to="/app/warden/complaints" className="text-[#2B2644] font-semibold hover:underline">
              Inspect Redressal Queue →
            </Link>
          </div>
        </Card>

        {/* Chart 2: After-Hours Gate Activity Hourly Sparkline */}
        <Card variant="elevated" className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#141320]">After-Hours Gate Activity</h3>
                <p className="text-xs text-[#64677A]">Hourly entry sparkline during restricted hours (18:00 – 08:00)</p>
              </div>
              <Badge variant="purple">Night Radar</Badge>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={afterHoursHourlyData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(43,38,68,0.06)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="entries"
                    stroke="#2B2644"
                    strokeWidth={2.5}
                    dot={{ fill: '#2B2644', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="After-Hours Entries"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2B2644]/8 text-xs text-[#64677A] flex items-center justify-between mt-2">
            <span>Night Peak: 22:00 – 23:00 (Research labs)</span>
            <Link to="/app/security" className="text-[#2B2644] font-semibold hover:underline">
              Security Console →
            </Link>
          </div>
        </Card>
      </div>

      {/* Mess Headcount Booked vs Served Bar Chart */}
      <Card variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#141320]">Mess Headcount: Booked vs Served</h3>
            <p className="text-xs text-[#64677A]">Tracking meal consumption and uncollected waste</p>
          </div>
          <Link to="/app/mess-manager" className="text-xs text-[#2B2644] hover:underline font-semibold">
            Mess Manager Desk →
          </Link>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(43,38,68,0.06)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <RechartsTooltip />
              <Bar dataKey="booked" fill="#2B2644" radius={[6, 6, 0, 0]} name="Booked" />
              <Bar dataKey="served" fill="#C5CBE8" radius={[6, 6, 0, 0]} name="Served" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 mt-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-[3px] bg-[#2B2644]" />
            <span className="text-[#64677A]">Total Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-[3px] bg-[#C5CBE8]" />
            <span className="text-[#64677A]">Actually Served</span>
          </div>
        </div>
      </Card>

      {/* Live Campus Grievance Escalation Queue Preview */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="p-6 pb-4 border-b border-[#2B2644]/8 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#141320]">Active Campus Grievance Queue</h3>
            <p className="text-xs text-[#64677A]">Live tickets requiring department resolution and warden oversight</p>
          </div>
          <Link to="/app/warden/complaints" className="text-xs font-semibold text-[#2B2644] hover:underline flex items-center gap-1">
            <span>Manage All Escalations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F6FA] border-b border-[#2B2644]/8 text-[#64677A] uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Ref ID</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Issue Title</th>
                <th className="py-3 px-4">Assigned Dept</th>
                <th className="py-3 px-4">Priority & Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B2644]/6">
              {complaints.filter(c => c.status !== 'Resolved').slice(0, 5).map(c => {
                const stu = students.find(s => s.id === c.studentId)
                return (
                  <tr key={c.id} className="hover:bg-[#F5F6FA]/60">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2B2644]">{c.refId}</td>
                    <td className="py-3.5 px-4">
                      {c.isAnonymous ? (
                        <span className="text-[#64677A] italic">Anonymous</span>
                      ) : (
                        <span className="font-semibold text-[#141320]">{stu?.name || 'Scholar'}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#2B2644]/6 text-[#2B2644] font-medium text-[10px]">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-semibold text-[#141320] line-clamp-1">{c.title}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#64677A]">{c.assignedTo || 'Unassigned'}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={c.priority === 'Urgent' ? 'error' : 'neutral'}>{c.priority}</Badge>
                        <Badge variant="purple">{c.status}</Badge>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/app/complaints/${c.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-[#2B2644] hover:underline"
                      >
                        <span>Inspect</span>
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
