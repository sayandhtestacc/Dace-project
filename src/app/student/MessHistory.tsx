import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Utensils, Calendar, ArrowLeft, Filter, CheckCircle2 } from 'lucide-react'
import { useStore } from '@/data/store'
import { formatINR, relativeTime } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export default function MessHistory() {
  const { mealBookings, currentStudentId } = useStore()
  const [filterType, setFilterType] = useState<string>('all')

  const myBookings = mealBookings.filter((b) => b.studentId === currentStudentId)

  const filtered = filterType === 'all' ? myBookings : myBookings.filter((b) => b.status === filterType)

  const totalSpent = myBookings
    .filter((b) => b.status === 'served')
    .reduce((acc, curr) => acc + curr.price, 0)

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <Link
          to="/app/mess"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64677A] hover:text-[#141320]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Mess Menu</span>
        </Link>
        <Link to="/app/mess/wallet">
          <Button variant="outline" size="sm">
            View Fee Wallet
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight">
          Meal Booking History
        </h1>
        <p className="text-xs sm:text-sm text-[#64677A] mt-1">
          Historical log of booked, collected, and refund-skipped meals.
        </p>
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="elevated" className="p-4 text-center">
          <span className="text-[10px] text-[#64677A] uppercase font-bold block">Total Bookings</span>
          <span className="text-xl font-bold text-[#141320]">{myBookings.length}</span>
        </Card>
        <Card variant="elevated" className="p-4 text-center">
          <span className="text-[10px] text-[#64677A] uppercase font-bold block">Meals Served</span>
          <span className="text-xl font-bold text-emerald-600">
            {myBookings.filter((b) => b.status === 'served').length}
          </span>
        </Card>
        <Card variant="elevated" className="p-4 text-center">
          <span className="text-[10px] text-[#64677A] uppercase font-bold block">Spent (Served)</span>
          <span className="text-xl font-bold text-[#2B2644]">{formatINR(totalSpent)}</span>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'booked', 'served', 'skipped'].map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-4 py-1.5 text-xs rounded-full font-medium capitalize transition-colors ${
              filterType === f
                ? 'bg-[#2B2644] text-white'
                : 'bg-white border border-[rgba(43,38,68,0.1)] text-[#64677A] hover:bg-[#F5F6FA]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card variant="elevated" className="p-6">
        {filtered.length === 0 ? (
          <p className="text-xs text-[#64677A] py-8 text-center">No bookings match this filter.</p>
        ) : (
          <div className="divide-y divide-[rgba(43,38,68,0.06)]">
            {filtered.map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[rgba(43,38,68,0.06)] flex items-center justify-center text-[#2B2644]">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#141320]">
                      {b.mealType} · {b.date}
                    </h4>
                    <span className="text-[10px] text-[#64677A]">Booked {relativeTime(b.bookedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-[#141320]">{formatINR(b.price)}</span>
                  <Badge
                    variant={
                      b.status === 'served'
                        ? 'success'
                        : b.status === 'booked'
                        ? 'purple'
                        : 'warning'
                    }
                  >
                    {b.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
