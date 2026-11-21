import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
  Plus,
  AlertTriangle,
  CreditCard,
  CheckCircle2,
  Receipt,
  ArrowRight,
} from 'lucide-react'
import { useStore } from '@/data/store'
import { formatINR, relativeTime } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

export default function MessWallet() {
  const { currentStudentId, students, walletTxns, topUpWallet } = useStore()
  const { success } = useToast()

  const [isTopUpOpen, setIsTopUpOpen] = useState(false)
  const [customAmount, setCustomAmount] = useState('500')

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0]
  const myTxns = walletTxns.filter((t) => t.studentId === currentStudent.id)

  const handleTopUp = (amt: number) => {
    topUpWallet(currentStudent.id, amt)
    setIsTopUpOpen(false)
    success(`Successfully added ${formatINR(amt)} to Mess Wallet!`)
  }

  const quickAmounts = [200, 500, 1000, 2000]

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
            Module B · Internal Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight">
            Mess Fee Wallet
          </h1>
          <p className="text-xs sm:text-sm text-[#64677A] mt-1">
            Simulated campus payment balance. Automatic debit on booking and refund on skip.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsTopUpOpen(true)}
          iconLeft={<Plus className="w-4 h-4" />}
        >
          Top Up Balance
        </Button>
      </div>

      {/* Low Balance Warning Banner */}
      {currentStudent.walletBalance < 100 && (
        <div className="p-4 rounded-[20px] bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold">Low Wallet Balance Alert</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Your current balance ({formatINR(currentStudent.walletBalance)}) is below the minimum meal threshold. Please top up to book upcoming meals.
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setIsTopUpOpen(true)}>
            Top up ₹500
          </Button>
        </div>
      )}

      {/* Top balance banner */}
      <div className="bg-[#2B2644] text-white rounded-[24px] p-8 flex flex-wrap items-center justify-between gap-6 shadow-xl border border-white/10">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#C9C7DA] font-semibold block mb-2">
            Available Mess Credit
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            {formatINR(currentStudent.walletBalance)}
          </div>
          <p className="text-xs text-[#C9C7DA] mt-3">
            Linked Account: {currentStudent.name} ({currentStudent.department})
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => handleTopUp(500)}
            className="bg-white text-[#2B2644] hover:bg-[#E9ECF6] border-none font-semibold px-6 py-3 rounded-full"
          >
            Quick Top-up +₹500
          </Button>
          <span className="text-[11px] text-[#C9C7DA] text-center">Simulated instant credit</span>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-[24px] p-6 overflow-x-auto border border-[#2B2644]/8 shadow-[0_8px_30px_rgba(43,38,68,0.05)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#141320]">Transaction Ledger</h3>
            <p className="text-xs text-[#64677A]">Complete statement of bookings, skips, and top-ups</p>
          </div>
          <span className="text-xs text-[#64677A] font-mono">{myTxns.length} entries</span>
        </div>

        {myTxns.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#64677A]">
            No wallet activity recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-[#2B2644]/8">
            {myTxns.map((t) => {
              const isPositive = t.amount > 0
              return (
                <div key={t.id} className="py-4 px-4 flex items-center justify-between hover:bg-[#F5F6FA] rounded-[12px] transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        t.type === 'topup'
                          ? 'bg-[#EEF6F3] text-[#1E6B52]'
                          : t.type === 'refund'
                          ? 'bg-[#E9ECF6] text-[#2B2644]'
                          : 'bg-[#FBF0F2] text-[#9E2A3B]'
                      }`}
                    >
                      {t.type === 'topup' && <ArrowDownLeft className="w-4 h-4" />}
                      {t.type === 'refund' && <RotateCcw className="w-4 h-4" />}
                      {t.type === 'deduction' && <ArrowUpRight className="w-4 h-4" />}
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-[#141320]">{t.description}</h4>
                      <span className="text-[10px] text-[#64677A]">{relativeTime(t.createdAt)}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-sm font-bold block ${
                        isPositive ? 'text-[#1E6B52]' : 'text-[#9E2A3B]'
                      }`}
                    >
                      {isPositive ? `+${formatINR(t.amount)}` : formatINR(t.amount)}
                    </span>
                    <span className="text-[10px] text-[#64677A]">
                      Balance: {formatINR(t.balanceAfter)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Top Up Modal */}
      <Modal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        title="Top Up Mess Wallet"
        description="Select a mock amount to top up your demo balance. No real money required."
      >
        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-2">
              Select Preset Amount
            </label>
            <div className="grid grid-cols-2 gap-3">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setCustomAmount(String(amt))}
                  className={`p-3.5 rounded-[16px] border text-center font-bold text-sm transition-all ${
                    customAmount === String(amt)
                      ? 'border-[#2B2644] bg-[#2B2644] text-white shadow-xs'
                      : 'border-[rgba(43,38,68,0.12)] bg-[#F5F6FA] text-[#141320] hover:bg-[#E9ECF6]/60'
                  }`}
                >
                  +{formatINR(amt)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
              Custom Amount (₹)
            </label>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full h-12 px-4 rounded-[14px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.1)] text-sm font-bold text-[#141320] outline-none focus:border-[#2B2644]"
            />
          </div>

          <div className="p-3.5 rounded-[14px] bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Simulated transaction: credits will update your dashboard immediately.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="md" onClick={() => setIsTopUpOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleTopUp(Number(customAmount) || 500)}
            >
              Confirm Top-up (+{formatINR(Number(customAmount) || 500)})
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
