import React, { useState } from 'react'
import {
  Utensils,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Clock,
  User,
  Coffee,
  Check,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from 'recharts'
import { useStore } from '@/data/store'
import { relativeTime, formatINR } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export default function AdminMess() {
  const { weeklyMenu, mealBookings, students, markServed } = useStore()
  const { success } = useToast()

  const [selectedMealType, setSelectedMealType] = useState<string>('all')

  // Tomorrow's headcount calculation
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
  const tomorrowBookings = mealBookings.filter((b) => b.date === tomorrow && b.status === 'booked')

  const tomorrowBreakfast = tomorrowBookings.filter((b) => b.mealType === 'Breakfast').length || 42
  const tomorrowLunch = tomorrowBookings.filter((b) => b.mealType === 'Lunch').length || 88
  const tomorrowDinner = tomorrowBookings.filter((b) => b.mealType === 'Dinner').length || 65

  // Today's bookings for the "Mark served" queue
  const todayStr = new Date().toISOString().split('T')[0]
  const todayList = mealBookings.filter((b) => b.date === todayStr)

  const filteredTodayList = selectedMealType === 'all'
    ? todayList
    : todayList.filter((b) => b.mealType === selectedMealType)

  const handleMarkServed = (bookingId: string) => {
    markServed(bookingId)
    success('Meal marked as served & collected')
  }

  // 7-day chart data
  const chartData = [
    { day: 'Day -6', booked: 190, served: 180, waste: 10 },
    { day: 'Day -5', booked: 205, served: 195, waste: 10 },
    { day: 'Day -4', booked: 220, served: 212, waste: 8 },
    { day: 'Day -3', booked: 198, served: 190, waste: 8 },
    { day: 'Day -2', booked: 215, served: 205, waste: 10 },
    { day: 'Yesterday', booked: 225, served: 219, waste: 6 },
    { day: 'Today', booked: 210, served: 185, waste: 25 },
  ]

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider">
              Mess Manager Portal
            </span>
            <Badge variant="purple">DEMO DATA</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight mt-1">
            Kitchen Headcount & Service Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#64677A] mt-1">
            Real-time meal consumption tracking, advance kitchen quota forecasting, and waste auditing.
          </p>
        </div>

        <Badge variant="success" pulse>
          Live Kitchen Sync Active
        </Badge>
      </div>

      {/* 7.3 Tomorrow's Expected Headcount (Three Big Counter Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#141320] uppercase tracking-wider">
            Tomorrow's Headcount Quota ({tomorrow})
          </span>
          <span className="text-xs text-[#64677A]">Locked at 8:00 PM cutoff today</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card variant="elevated" className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#64677A] uppercase block mb-1">
                Breakfast Prep
              </span>
              <div className="text-4xl font-extrabold text-[#141320]">{tomorrowBreakfast}</div>
              <span className="text-xs text-emerald-600 font-medium mt-1 block">
                Target: Idli / Dosa Sambar
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E9ECF6] flex items-center justify-center text-[#2B2644]">
              <Coffee className="w-6 h-6" />
            </div>
          </Card>

          <Card variant="elevated" className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#64677A] uppercase block mb-1">
                Lunch Prep
              </span>
              <div className="text-4xl font-extrabold text-[#2B2644]">{tomorrowLunch}</div>
              <span className="text-xs text-emerald-600 font-medium mt-1 block">
                Target: Biriyani / Meals
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>
          </Card>

          <Card variant="elevated" className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#64677A] uppercase block mb-1">
                Dinner Prep
              </span>
              <div className="text-4xl font-extrabold text-[#11101D]">{tomorrowDinner}</div>
              <span className="text-xs text-emerald-600 font-medium mt-1 block">
                Target: Chapati & Dal
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-50 text-[#2B2644] flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>
          </Card>
        </div>
      </div>

      {/* 7-Day Booked vs Served Bar Chart & Waste Reduction KPI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <Card variant="elevated" className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#141320]">7-Day Cooking Efficiency</h3>
              <p className="text-xs text-[#64677A]">Booked vs served meal totals over time</p>
            </div>
            <Badge variant="purple">Efficiency 95.8%</Badge>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(43,38,68,0.06)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RechartsTooltip />
                <Bar dataKey="booked" fill="#2B2644" radius={[6, 6, 0, 0]} name="Booked" />
                <Bar dataKey="served" fill="#C5CBE8" radius={[6, 6, 0, 0]} name="Served" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Waste Reduction KPI Card */}
        <Card variant="dark" className="p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs text-[#C9C7DA] uppercase font-bold tracking-wider block mb-2">
              Food Waste KPI
            </span>
            <div className="text-4xl font-extrabold text-emerald-400">92.4%</div>
            <p className="text-xs text-[#C9C7DA] mt-2 leading-relaxed">
              Waste reduction achieved compared to historical paper-based mess estimation.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-[#C9C7DA]">
            <div className="flex justify-between">
              <span>Uncollected Food:</span>
              <span className="text-white font-semibold">&lt; 5%</span>
            </div>
            <div className="flex justify-between">
              <span>Savings this month:</span>
              <span className="text-white font-semibold">₹18,450</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Service Desk: Student Bookings & Mark Served */}
      <Card variant="elevated" className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-[#141320]">Today's Dining Hall Queue</h3>
            <p className="text-xs text-[#64677A]">Validate student meal collection at dining counter</p>
          </div>

          {/* Filter by Meal Type */}
          <div className="flex gap-2">
            {['all', 'Breakfast', 'Lunch', 'Dinner'].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMealType(m)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                  selectedMealType === m
                    ? 'bg-[#2B2644] text-white'
                    : 'bg-[#F5F6FA] text-[#64677A] hover:bg-[#E9ECF6]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F6FA] border-b border-[rgba(43,38,68,0.08)] text-[#64677A] uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Meal</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(43,38,68,0.06)]">
              {filteredTodayList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#64677A]">
                    No student bookings found for this meal filter.
                  </td>
                </tr>
              ) : (
                filteredTodayList.map((b) => {
                  const student = students.find((s) => s.id === b.studentId)
                  const isServed = b.status === 'served'
                  return (
                    <tr key={b.id} className="hover:bg-[#F5F6FA]/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#141320]">{student?.name}</td>
                      <td className="py-3 px-4 text-[#64677A]">{student?.department}</td>
                      <td className="py-3 px-4 font-medium text-[#2B2644]">{b.mealType}</td>
                      <td className="py-3 px-4">{formatINR(b.price)}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={isServed ? 'success' : b.status === 'booked' ? 'purple' : 'warning'}
                        >
                          {b.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isServed ? (
                          <span className="text-xs text-emerald-600 font-semibold flex items-center justify-end gap-1">
                            <Check className="w-3.5 h-3.5" /> Served
                          </span>
                        ) : b.status === 'skipped' ? (
                          <span className="text-xs text-[#64677A]">Skipped</span>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleMarkServed(b.id)}
                          >
                            Mark Served
                          </Button>
                        )}
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
