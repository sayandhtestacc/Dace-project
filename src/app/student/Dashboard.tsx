import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  Utensils,
  QrCode,
  Wallet,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
  Shield,
} from 'lucide-react'
import { useStore } from '@/data/store'
import { getGreeting, formatINR, relativeTime } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { currentStudentId, students, complaints, mealBookings, gateLogs, notifications } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200)
    return () => clearTimeout(timer)
  }, [])

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0]
  const myComplaints = complaints.filter((c) => c.studentId === currentStudent.id)
  const activeComplaints = myComplaints.filter((c) => c.status !== 'Resolved')

  // Check today's bookings
  const todayStr = new Date().toISOString().split('T')[0]
  const todayBookings = mealBookings.filter(
    (b) => b.studentId === currentStudent.id && b.date === todayStr && b.status === 'booked'
  )

  // Check gate status
  const currentGateLog = gateLogs.find((l) => l.studentId === currentStudent.id && l.exitTime === null)

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="card" className="h-32 rounded-[24px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton variant="card" className="h-44 rounded-[24px]" />
          <Skeleton variant="card" className="h-44 rounded-[24px]" />
          <Skeleton variant="card" className="h-44 rounded-[24px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 relative pb-16">
      {/* Welcome Banner & Greeting */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-[24px] border border-[#2B2644]/8 shadow-[0_8px_30px_rgba(43,38,68,0.05)]">
        <div>
          <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
            Student Space · Digital University Kerala
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight">
            {getGreeting()}, {currentStudent.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#64677A] mt-1">
            {currentStudent.department} · Year {currentStudent.year} · Digital ID: <span className="font-mono font-medium text-[#2B2644]">{currentStudent.qrToken}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/app/complaints/new">
            <Button variant="primary" size="md" iconLeft={<Plus className="w-4 h-4" />}>
              New Complaint
            </Button>
          </Link>
          <Link to="/app/qr">
            <Button variant="outline" size="md" iconLeft={<QrCode className="w-4 h-4" />}>
              Gate Pass
            </Button>
          </Link>
        </div>
      </div>

      {/* 3 KPI CARDS IN CLEAN ALIGNED 3-COLUMN GRID with unified lavender icon containers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: Open Complaints */}
        <Link to="/app/complaints" className="block group">
          <Card variant="elevated" className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-[#64677A] uppercase tracking-wider">
                  Open Complaints
                </span>
                <span className="p-2.5 rounded-full bg-[#F0F2FA] text-[#2B2644]">
                  <AlertCircle className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-bold text-[#141320] group-hover:text-[#2B2644] transition-colors">
                {activeComplaints.length}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-[#64677A] border-t border-[rgba(43,38,68,0.06)] pt-3">
              <span>{myComplaints.length} total tickets logged</span>
              <span className="text-[#2B2644] font-semibold group-hover:underline">Track →</span>
            </div>
          </Card>
        </Link>

        {/* KPI 2: Today's Meals */}
        <Link to="/app/mess" className="block group">
          <Card variant="elevated" className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-[#64677A] uppercase tracking-wider">
                  Today's Meals
                </span>
                <span className="p-2.5 rounded-full bg-[#F0F2FA] text-[#2B2644]">
                  <Utensils className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-bold text-[#141320] group-hover:text-[#2B2644] transition-colors">
                {todayBookings.length}{' '}
                <span className="text-base font-normal text-[#64677A]">Booked</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-[#64677A] border-t border-[rgba(43,38,68,0.06)] pt-3">
              <span>Cutoff: 8:00 PM tonight</span>
              <span className="text-[#2B2644] font-semibold group-hover:underline">Menu →</span>
            </div>
          </Card>
        </Link>

        {/* KPI 3: Gate Status */}
        <Link to="/app/qr" className="block group">
          <Card variant="elevated" className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-[#64677A] uppercase tracking-wider">
                  Gate Status
                </span>
                <span className="p-2.5 rounded-full bg-[#F0F2FA] text-[#2B2644]">
                  <Shield className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-[#141320]">
                {currentGateLog ? 'On Campus' : 'Off Campus'}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-[#64677A] border-t border-[rgba(43,38,68,0.06)] pt-3">
              <span className="truncate max-w-[140px]">{currentGateLog ? currentGateLog.destination : 'Ready for scan'}</span>
              <span className="text-[#2B2644] font-semibold group-hover:underline">Pass →</span>
            </div>
          </Card>
        </Link>
      </div>

      {/* 2 BIG FEATURE CARDS IN CLEAN ALIGNED 2-COLUMN GRID (grid-cols-1 lg:grid-cols-2 gap-6) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Mess Headcount System */}
        <Card variant="elevated" className="p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-full bg-[#F0F2FA] text-[#2B2644]">
                  <Utensils className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-[#141320]">Mess Headcount System</h3>
              </div>
              <Badge variant="purple">Module B</Badge>
            </div>
            <p className="text-xs text-[#64677A] leading-relaxed mb-4">
              Advance scheduling minimizes kitchen over-cooking and waste. Uncollected meals skipped before 8:00 PM are instantly refunded to your fee wallet.
            </p>

            <div className="p-4 rounded-[18px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.06)] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#64677A] uppercase font-bold block">Wallet Balance</span>
                <span className="text-lg font-bold text-[#141320]">{formatINR(currentStudent.walletBalance)}</span>
              </div>
              <Link to="/app/mess">
                <Button variant="secondary" size="sm">
                  Tomorrow's Menu →
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[rgba(43,38,68,0.06)] flex items-center justify-between text-xs text-[#64677A]">
            <span>Next automatic lock: 8:00 PM</span>
            <Link to="/app/wallet" className="text-[#2B2644] font-semibold hover:underline">
              Top up Wallet →
            </Link>
          </div>
        </Card>

        {/* Card 2: Security Gate Log */}
        <Card variant="elevated" className="p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-full bg-[#F0F2FA] text-[#2B2644]">
                  <QrCode className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-[#141320]">Security Gate Log</h3>
              </div>
              <Badge variant="purple">Module C</Badge>
            </div>
            <p className="text-xs text-[#64677A] leading-relaxed mb-4">
              Scan your 30-second regenerating token at the security barrier or scan the gate QR for bidirectional check-in and checkout.
            </p>

            <div className="p-4 rounded-[18px] bg-gradient-to-r from-[#E9ECF6] to-[#C5CBE8] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#2B2644]/70 uppercase font-bold block">Turnstile Gate 1 & 2</span>
                <span className="text-xs font-bold text-[#2B2644]">Dual-Mode QR Active</span>
              </div>
              <Link to="/app/qr">
                <Button variant="primary" size="sm">
                  Open Scanner →
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[rgba(43,38,68,0.06)] flex items-center justify-between text-xs text-[#64677A]">
            <span>Auto-expires after 90 days</span>
            <Link to="/app/gate/history" className="text-[#2B2644] font-semibold hover:underline">
              Visit Log History →
            </Link>
          </div>
        </Card>
      </div>

      {/* Row 3 (Activity Feed): Clean white card */}
      <div className="bg-white rounded-[20px] p-6 border border-[#2B2644]/8 shadow-[0_8px_30px_rgba(43,38,68,0.05)]">
        <div className="flex items-center justify-between pb-4 border-b border-[#2B2644]/8">
          <h3 className="text-sm font-bold text-[#141320]">Recent Activity Feed</h3>
          <span className="text-xs text-[#64677A]">Live client-side events</span>
        </div>

        <div className="divide-y divide-[#2B2644]/8">
          {notifications.slice(0, 4).map((n) => (
            <div
              key={n.id}
              className="py-3.5 flex items-start gap-3.5 hover:bg-[#F5F6FA] px-2 rounded-[12px] transition-colors"
            >
              <div className="p-2 rounded-full bg-[#F5F6FA] shrink-0 mt-0.5 text-[#2B2644]">
                <CheckCircle2 className="w-4 h-4 text-[#2B2644]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#141320]">{n.title}</h4>
                  <span className="text-[10px] text-[#64677A]">{relativeTime(n.createdAt)}</span>
                </div>
                <p className="text-xs text-[#64677A] mt-0.5 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
