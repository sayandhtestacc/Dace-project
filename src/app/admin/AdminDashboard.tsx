import React from 'react'
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
  Building,
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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

export default function AdminDashboard() {
  const { complaints, mealBookings, gateLogs, notifications } = useStore()

  // KPIs
  const openComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length
  const todayStr = new Date().toISOString().split('T')[0]
  const todayBookingsCount = mealBookings.filter((b) => b.date === todayStr && b.status === 'booked').length
  const currentlyOnCampusCount = gateLogs.filter((l) => l.exitTime === null).length

  // Category breakdown for Pie Chart
  const categories = ['Technical', 'Hostel', 'Academic', 'Mess', 'Other']
  const categoryData = categories.map((cat) => ({
    name: cat,
    value: complaints.filter((c) => c.category === cat).length || 1,
  }))
  const PIE_COLORS = ['#2B2644', '#4B4376', '#64677A', '#C5CBE8', '#E9ECF6']

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

  // Gate hourly entries
  const hourlyGateData = [
    { hour: '06:00', entries: 4 },
    { hour: '08:00', entries: 28 },
    { hour: '10:00', entries: 45 },
    { hour: '12:00', entries: 32 },
    { hour: '14:00', entries: 39 },
    { hour: '16:00', entries: 51 },
    { hour: '18:00', entries: 24 },
    { hour: '20:00', entries: 15 },
  ]

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider">
              Administration & Analytics
            </span>
            <Badge variant="purple">DEMO DATA</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight mt-1">
            Campus Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#64677A] mt-1">
            Consolidated intelligence across grievance status, mess preparation count, and security occupancy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/complaints">
            <Button variant="primary" size="sm">
              Manage Complaints
            </Button>
          </Link>
          <Link to="/admin/gate">
            <Button variant="outline" size="sm">
              Live Gate Log
            </Button>
          </Link>
        </div>
      </div>

      {/* 8.4 KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <Card variant="elevated" className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#64677A] uppercase">Active Complaints</span>
            <span className="p-1.5 rounded-full bg-red-50 text-red-600">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-bold text-[#141320]">{openComplaintsCount}</div>
          <p className="text-[11px] text-[#64677A] mt-2">
            {resolvedCount} resolved this semester
          </p>
        </Card>

        <Card variant="elevated" className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#64677A] uppercase">Avg Resolution Time</span>
            <span className="p-1.5 rounded-full bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-bold text-[#2B2644]">14.2h</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> -4.1h vs paper register
          </p>
        </Card>

        <Card variant="elevated" className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#64677A] uppercase">Today's Meals Booked</span>
            <span className="p-1.5 rounded-full bg-emerald-50 text-emerald-600">
              <Utensils className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-bold text-[#141320]">{todayBookingsCount || 142}</div>
          <p className="text-[11px] text-[#64677A] mt-2">
            Accurate headcounts for mess cook
          </p>
        </Card>

        <Card variant="elevated" className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#64677A] uppercase">Currently Inside Gate</span>
            <span className="p-1.5 rounded-full bg-purple-50 text-[#2B2644]">
              <Shield className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-bold text-emerald-600 flex items-center gap-2">
            <span>{currentlyOnCampusCount}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <p className="text-[11px] text-[#64677A] mt-2">
            Automated turnstile & QR scans
          </p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Complaints by Category Donut */}
        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#141320]">Complaints by Category</h3>
              <p className="text-xs text-[#64677A]">Distribution across campus service departments</p>
            </div>
            <Badge variant="purple">Breakdown</Badge>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-xs">
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                />
                <span className="text-[#64677A]">{item.name}</span>
                <span className="font-semibold text-[#141320]">({item.value})</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Chart 2: Last 7 Days Meals Booked vs Served Bar Chart */}
        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#141320]">Mess Headcount: Booked vs Served</h3>
              <p className="text-xs text-[#64677A]">Tracking meal consumption and uncollected waste</p>
            </div>
            <Link to="/admin/mess" className="text-xs text-[#2B2644] hover:underline font-semibold">
              Mess Desk →
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
      </div>

      {/* Chart 3: Hourly Gate Entries (Line Chart) */}
      <Card variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#141320]">Campus Gate Traffic Profile</h3>
            <p className="text-xs text-[#64677A]">Hourly entry distribution through security barriers</p>
          </div>
          <Link to="/admin/gate" className="text-xs text-[#2B2644] hover:underline font-semibold">
            Security Desk →
          </Link>
        </div>

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyGateData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(43,38,68,0.06)" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <RechartsTooltip />
              <Line
                type="monotone"
                dataKey="entries"
                stroke="#2B2644"
                strokeWidth={3}
                dot={{ fill: '#2B2644', r: 4 }}
                activeDot={{ r: 6 }}
                name="Entries"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Activity Stream */}
      <Card variant="elevated" className="p-6">
        <h3 className="text-sm font-bold text-[#141320] mb-4">Live Campus Activity Stream</h3>
        <div className="divide-y divide-[rgba(43,38,68,0.06)]">
          {notifications.map((n) => (
            <div key={n.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F5F6FA] flex items-center justify-center text-[#2B2644]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#141320]">{n.title}</h4>
                  <p className="text-xs text-[#64677A]">{n.message}</p>
                </div>
              </div>
              <span className="text-[11px] text-[#64677A] shrink-0">{relativeTime(n.createdAt)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
