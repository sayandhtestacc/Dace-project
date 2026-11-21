import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Utensils,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wallet,
  ChevronRight,
  Info,
  Calendar,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import { useStore } from '@/data/store'
import type { MealType, MenuItem } from '@/data/types'
import { formatINR } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { useToast } from '@/components/ui/Toast'

export default function MessMenu() {
  const { weeklyMenu, mealBookings, currentStudentId, students, bookMeal, skipMeal } = useStore()
  const { success, warning, info } = useToast()

  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0]

  const activeDay = weeklyMenu[selectedDayIndex] || weeklyMenu[0]

  // Calculate live countdown to 8:00 PM cutoff today
  const [timeLeft, setTimeLeft] = useState('')
  const [isPastCutoff, setIsPastCutoff] = useState(false)

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const cutoff = new Date()
      cutoff.setHours(20, 0, 0, 0) // 8:00 PM today

      const diff = cutoff.getTime() - now.getTime()
      if (diff <= 0) {
        setIsPastCutoff(true)
        setTimeLeft('Cutoff Passed (8:00 PM)')
      } else {
        setIsPastCutoff(false)
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s left`)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  // Check today's booked items
  const dayBookings = mealBookings.filter(
    (b) => b.studentId === currentStudent.id && b.date === activeDay.date
  )

  const handleBook = (meal: MenuItem) => {
    if (currentStudent.walletBalance < meal.price) {
      warning(`Insufficient wallet balance (${formatINR(currentStudent.walletBalance)}). Please top up first.`)
      return
    }

    bookMeal(currentStudent.id, activeDay.date, meal.mealType, meal.price)
    success(`Booked ${meal.mealType} for ${activeDay.dayName} (-${formatINR(meal.price)})`)
  }

  const handleSkip = (bookingId: string, mealType: string) => {
    if (selectedDayIndex === 0 && isPastCutoff) {
      warning('Cannot skip today’s meal after the 8:00 PM cutoff deadline.')
      return
    }

    skipMeal(bookingId)
    info(`Skipped ${mealType}. Wallet refunded!`)
  }

  // Summary of today's booked cost
  const totalDayCost = dayBookings
    .filter((b) => b.status === 'booked')
    .reduce((acc, curr) => acc + curr.price, 0)

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
            Module B · Smart Mess Booking
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight">
            Weekly Dining Menu
          </h1>
          <p className="text-xs sm:text-sm text-[#64677A] mt-1">
            Advance headcount scheduling. Un-eaten meals skipped before 8:00 PM are instantly refunded.
          </p>
        </div>

        <Link to="/app/mess/wallet">
          <div className="flex items-center gap-3 p-3 px-5 rounded-full bg-white border border-[rgba(43,38,68,0.1)] shadow-xs hover:border-[#2B2644] transition-colors">
            <Wallet className="w-4 h-4 text-[#2B2644]" />
            <div className="text-left">
              <span className="text-[10px] text-[#64677A] uppercase font-bold block leading-none">
                Wallet
              </span>
              <span className="text-sm font-bold text-[#141320] leading-tight">
                {formatINR(currentStudent.walletBalance)}
              </span>
            </div>
            <span className="text-xs text-[#2B2644] font-semibold ml-2">Top up →</span>
          </div>
        </Link>
      </div>

      {/* 7.1 7-Day Horizontal Day Selector (Sliding Pill) */}
      <div className="bg-white p-3 rounded-[24px] border border-[rgba(43,38,68,0.08)] shadow-xs overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {weeklyMenu.map((d, index) => {
            const isSelected = index === selectedDayIndex
            const isToday = index === 0
            return (
              <button
                key={d.date}
                onClick={() => setSelectedDayIndex(index)}
                className={`px-5 py-3 rounded-[18px] text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2B2644] text-white shadow-sm'
                    : 'bg-[#F5F6FA] text-[#141320] hover:bg-[#E9ECF6]/60'
                }`}
              >
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider block ${
                    isSelected ? 'text-[#C9C7DA]' : 'text-[#64677A]'
                  }`}
                >
                  {isToday ? 'Today' : d.dayName.slice(0, 3)}
                </span>
                <span className="text-sm font-semibold">{d.dayName}</span>
                <span
                  className={`text-[11px] block mt-0.5 ${
                    isSelected ? 'text-white/80' : 'text-[#64677A]'
                  }`}
                >
                  {d.date.slice(5)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Cutoff Notice Banner */}
      <div className="p-4.5 rounded-[20px] bg-[#E9ECF6]/60 border border-[rgba(43,38,68,0.1)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-[#2B2644] shrink-0" />
          <span className="text-xs font-bold text-[#141320]">
            Kitchen Headcount Cutoff Deadline (Daily 8:00 PM):
          </span>
          <Badge variant={isPastCutoff ? 'warning' : 'purple'} pulse={!isPastCutoff}>
            {timeLeft}
          </Badge>
        </div>
        <span className="text-[11px] text-[#64677A]">
          Skipping before deadline triggers 100% wallet credit refund.
        </span>
      </div>

      {/* 3 Meal Cards Grid (Breakfast, Lunch, Dinner) in clean 3-col grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeDay.meals.map((meal) => {
          const booking = dayBookings.find((b) => b.mealType === meal.mealType)
          const isBooked = booking && booking.status === 'booked'
          const isSkipped = booking && booking.status === 'skipped'
          const isServed = booking && booking.status === 'served'

          return (
            <Card
              key={meal.mealType}
              variant="elevated"
              className="p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full border-2 border-white shadow-xs ${
                        meal.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                      title={meal.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                    />
                    <h3 className="text-lg font-bold text-[#141320]">{meal.mealType}</h3>
                  </div>

                  <span className="text-sm font-bold text-[#2B2644]">
                    {formatINR(meal.price)}
                  </span>
                </div>

                {/* Items List */}
                <div className="bg-[#F5F6FA] p-4 rounded-[16px] border border-[rgba(43,38,68,0.06)] mb-6">
                  <span className="text-[10px] text-[#64677A] uppercase font-bold tracking-wider block mb-2">
                    Served Items
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#141320] font-medium">
                    {meal.items.map((it) => (
                      <li key={it} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2B2644]" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Booking Actions */}
              <div className="pt-4 border-t border-[rgba(43,38,68,0.06)] flex items-center justify-between">
                <div>
                  {isBooked ? (
                    <Badge variant="success" pulse>
                      Booked
                    </Badge>
                  ) : isServed ? (
                    <Badge variant="neutral">Served</Badge>
                  ) : isSkipped ? (
                    <Badge variant="warning">Skipped (Refunded)</Badge>
                  ) : (
                    <span className="text-xs text-[#64677A]">Not booked yet</span>
                  )}
                </div>

                <div>
                  {isBooked ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSkip(booking.id, meal.mealType)}
                      disabled={selectedDayIndex === 0 && isPastCutoff}
                      title={
                        selectedDayIndex === 0 && isPastCutoff
                          ? 'Cutoff has passed for today'
                          : 'Cancel booking and refund amount'
                      }
                    >
                      Skip & Refund
                    </Button>
                  ) : isServed ? (
                    <span className="text-xs font-semibold text-emerald-700">Meal Collected</span>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleBook(meal)}
                    >
                      Book Meal ({formatINR(meal.price)})
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Sticky Bottom Summary Tray: lg:left-64 so it never collides with sidebar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white/95 backdrop-blur-md border-t border-[rgba(43,38,68,0.1)] py-3 px-6 sm:px-8 z-30 shadow-[0_-8px_24px_rgba(43,38,68,0.08)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] text-[#64677A] uppercase font-bold block leading-none">
                {activeDay.dayName} Total
              </span>
              <span className="text-base font-bold text-[#141320]">
                {dayBookings.filter((b) => b.status === 'booked').length} meals booked ({formatINR(totalDayCost)})
              </span>
            </div>

            <div className="hidden sm:block pl-6 border-l border-[rgba(43,38,68,0.1)]">
              <span className="text-[10px] text-[#64677A] uppercase font-bold block leading-none">
                Remaining Wallet
              </span>
              <span className="text-sm font-semibold text-emerald-700">
                {formatINR(currentStudent.walletBalance)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/app/mess/history">
              <Button variant="ghost" size="sm">
                Past Bookings
              </Button>
            </Link>
            <Link to="/app/mess/wallet">
              <Button variant="secondary" size="sm">
                Wallet History
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
