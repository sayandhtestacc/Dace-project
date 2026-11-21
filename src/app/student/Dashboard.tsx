import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  Utensils,
  QrCode,
  Wallet,
  Clock,
  ArrowRight,
  Plus,
  Bell,
  CheckCircle2,
  AlertTriangle,
  X,
  Compass,
  ChevronRight,
  TrendingUp,
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
  const [isFabOpen, setIsFabOpen] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(true)

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
    <div className="space-y-8 relative pb-20">
      {/* 46. Dismissible Pinned Announcement */}
      {showAnnouncement && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 rounded-[20px] bg-gradient-to-r from-[#2B2644] to-[#11101D] text-white flex items-center justify-between shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-full bg-white/10 text-[#C5CBE8] shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-white">
                Scheduled Maintenance: Campus Wi-Fi upgrade on Saturday, 10:00 PM – 4:00 AM.
              </p>
              <p className="text-[11px] text-[#C9C7DA]">Academic Block B & Hostel A access points will restart.</p>
            </div>
          </div>
          <button
            onClick={() => setShowAnnouncement(false)}
            className="p-1.5 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors shrink-0"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* 41. Welcome Banner & Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white p-6 sm:p-8 rounded-[24px] border border-[rgba(43,38,68,0.08)] shadow-[0_4px_24px_-4px_rgba(43,38,68,0.06)]">
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
          <Link to="/app/gate">
            <Button variant="outline" size="md" iconLeft={<QrCode className="w-4 h-4" />}>
              Gate Pass
            </Button>
          </Link>
        </div>
      </div>

      {/* 3 KPI CARDS IN CLEAN ALIGNED 3-COLUMN GRID (grid-cols-1 md:grid-cols-3 gap-6) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: Open Complaints */}
        <Link to="/app/complaints" className="block group">
          <Card variant="elevated" className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-[#64677A] uppercase tracking-wider">
                  Open Complaints
                </span>
                <span className="p-2 rounded-full bg-red-50 text-red-600">
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
                <span className="p-2 rounded-full bg-emerald-50 text-emerald-600">
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
        <Link to="/app/gate" className="block group">
          <Card variant="elevated" className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-[#64677A] uppercase tracking-wider">
                  Gate Status
                </span>
                <span className="p-2 rounded-full bg-purple-50 text-[#2B2644]">
                  <Shield className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-[#141320] flex items-center gap-2.5">
                {currentGateLog ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span>On Campus</span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 rounded-full bg-slate-400" />
                    <span>Off Campus</span>
                  </>
                )}
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
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-full bg-emerald-50 text-emerald-600">
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
            <Link to="/app/mess/wallet" className="text-[#2B2644] font-semibold hover:underline">
              Top up Wallet →
            </Link>
          </div>
        </Card>

        {/* Card 2: Security Gate Log */}
        <Card variant="elevated" className="p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-full bg-purple-50 text-[#2B2644]">
                  <QrCode className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-[#141320]">Security Gate Log</h3>
              </div>
              <Badge variant="purple">Module C</Badge>
            </div>
            <p className="text-xs text-[#64677A] leading-relaxed mb-4">
              Scan your 30-second regenerating token at the security barrier for instant turnstile verification. Eliminates manual handwritten register queues.
            </p>

            <div className="p-4 rounded-[18px] bg-gradient-to-r from-[#E9ECF6] to-[#C5CBE8] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#2B2644]/70 uppercase font-bold block">Turnstile Gate 1 & 2</span>
                <span className="text-xs font-bold text-[#2B2644]">30s Rotating Token Active</span>
              </div>
              <Link to="/app/gate">
                <Button variant="primary" size="sm">
                  Show Pass →
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

      {/* 49. Recent Activity Feed */}
      <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-[rgba(43,38,68,0.08)] shadow-[0_4px_24px_-4px_rgba(43,38,68,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#141320]">Recent Activity Feed</h3>
          <span className="text-xs text-[#64677A]">Live client-side events</span>
        </div>

        <div className="space-y-3">
          {notifications.slice(0, 4).map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3.5 p-3.5 rounded-[16px] bg-[#F5F6FA] hover:bg-[#E9ECF6]/40 transition-colors"
            >
              <div className="p-2 rounded-full bg-white shadow-xs shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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

      {/* 23. Floating Action Button (FAB) Morph */}
      <div className="fixed bottom-24 right-6 z-40">
        <div className="relative">
          <AnimatePresence>
            {isFabOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                className="absolute bottom-16 right-0 mb-2 w-52 bg-white rounded-[20px] shadow-2xl border border-[rgba(43,38,68,0.12)] p-2 space-y-1"
              >
                <Link
                  to="/app/complaints/new"
                  onClick={() => setIsFabOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-[12px] hover:bg-[#F5F6FA] text-xs font-semibold text-[#141320]"
                >
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>Raise Complaint</span>
                </Link>
                <Link
                  to="/app/mess"
                  onClick={() => setIsFabOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-[12px] hover:bg-[#F5F6FA] text-xs font-semibold text-[#141320]"
                >
                  <Utensils className="w-4 h-4 text-emerald-600" />
                  <span>Book Tomorrow's Meal</span>
                </Link>
                <Link
                  to="/app/gate"
                  onClick={() => setIsFabOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-[12px] hover:bg-[#F5F6FA] text-xs font-semibold text-[#141320]"
                >
                  <QrCode className="w-4 h-4 text-[#2B2644]" />
                  <span>Scan Campus Gate</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsFabOpen(!isFabOpen)}
            className="w-13 h-13 rounded-full bg-[#11101D] text-white flex items-center justify-center shadow-xl hover:bg-[#2B2644] active:scale-95 transition-all cursor-pointer"
            aria-label="Quick Actions Menu"
          >
            <motion.div animate={{ rotate: isFabOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
              <Plus className="w-6 h-6" />
            </motion.div>
          </button>
        </div>
      </div>
    </div>
  )
}
