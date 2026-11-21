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
  Printer,
} from 'lucide-react'
import { useStore } from '@/data/store'
import { formatINR, relativeTime } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { playSuccessChime } from '@/lib/sound'

export default function MessWallet() {
  const { currentStudentId, students, walletTxns, topUpWallet } = useStore()
  const { success, info, warning } = useToast()

  const [isTopUpOpen, setIsTopUpOpen] = useState(false)
  const [customAmount, setCustomAmount] = useState('250')
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'sbi'>('gpay')
  const [paymentPhase, setPaymentPhase] = useState<'idle' | 'redirecting' | 'confirmed'>('idle')

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0]
  const myTxns = walletTxns.filter((t) => t.studentId === currentStudent.id)

  const handleStartPayment = (amt: number) => {
    if (amt <= 0) {
      warning('Please enter a valid amount')
      return
    }
    if (amt > 2000) {
      warning('Campus dining wallet limits single recharge to ₹2,000')
      return
    }

    setPaymentPhase('redirecting')

    // Simulate 2.2 second authentic UPI Gateway verification
    setTimeout(() => {
      topUpWallet(currentStudent.id, amt)
      playSuccessChime()
      setPaymentPhase('confirmed')

      setTimeout(() => {
        setIsTopUpOpen(false)
        setPaymentPhase('idle')
        success(`Recharge of ${formatINR(amt)} confirmed via UPI Intent!`)
      }, 1500)
    }, 2200)
  }

  const handlePrintStatement = () => {
    window.print()
  }

  const quickAmounts = [100, 250, 500, 1000]

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Print-Only Formal Statement Header */}
      <div className="print-only mb-6 border-b border-black/20 pb-4 text-left">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#141320]">Digital University Kerala</h1>
            <p className="text-xs text-[#64677A]">Campus Dining & Smart Mess Facility · Statement of Account</p>
          </div>
          <div className="text-right text-xs">
            <span className="font-semibold block">{currentStudent.name} ({currentStudent.department})</span>
            <span className="text-[#64677A] font-mono">Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
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

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={handlePrintStatement}
            iconLeft={<Printer className="w-4 h-4" />}
          >
            Export Statement
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsTopUpOpen(true)}
            iconLeft={<Plus className="w-4 h-4" />}
          >
            Top Up Balance
          </Button>
        </div>
      </div>

      {/* Low Balance Warning Banner */}
      {currentStudent.walletBalance < 100 && (
        <div className="p-4 rounded-[20px] bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-between no-print">
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
            onClick={() => setIsTopUpOpen(true)}
            className="bg-white text-[#2B2644] hover:bg-[#E9ECF6] border-none font-semibold px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-[#2B2644]" />
            <span>Recharge via UPI / Bank</span>
          </Button>
          <span className="text-[11px] text-[#C9C7DA] text-center">Institutional UPI / SBI Collect</span>
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

      {/* Institutional UPI Payment Gateway Modal */}
      <Modal
        isOpen={isTopUpOpen}
        onClose={() => {
          if (paymentPhase === 'idle') setIsTopUpOpen(false)
        }}
        title="DUK Campus Dining Fee Recharge"
        description="Institutional payment gateway for dining hall advance credits."
      >
        <div className="space-y-5">
          {/* Official Disclose Notice */}
          <div className="p-3.5 rounded-xl bg-[#E9ECF6]/60 border border-[#2B2644]/10 text-xs text-[#2B2644] leading-relaxed">
            <span className="font-bold block mb-0.5">Gateway Status: Demo Sandbox Mode</span>
            Direct real-money bank debits are disabled in this course demonstrator. In production, this redirects to the official <strong>Kerala Treasury / SBI Collect UPI Gateway</strong> (<code className="bg-[#2B2644]/6 px-1 rounded font-mono">duk.mess@sbi</code>).
          </div>

          {paymentPhase === 'redirecting' ? (
            <div className="py-10 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-[#2B2644]/20 border-t-[#2B2644] animate-spin" />
              <div>
                <h4 className="text-sm font-bold text-[#141320]">Redirecting to UPI Payment Gateway...</h4>
                <p className="text-xs text-[#64677A] mt-1 font-mono">
                  Awaiting bank callback from NPCI gateway ({selectedUpiApp.toUpperCase()})...
                </p>
              </div>
              <span className="text-[10px] text-[#64677A] bg-[#F5F6FA] px-3 py-1 rounded-full border border-[#2B2644]/10">
                🔒 256-Bit SSL Encrypted Campus Checkout
              </span>
            </div>
          ) : paymentPhase === 'confirmed' ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-[#1E6B52] text-white flex items-center justify-center shadow-md animate-bounce">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#141320]">Payment Authorized & Confirmed</h4>
                <p className="text-xs text-[#1E6B52] font-semibold mt-0.5">
                  Amount: {formatINR(Number(customAmount) || 250)} · Ref: UPI-DUK-{Math.floor(100000 + Math.random() * 899999)}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Preset Amounts */}
              <div>
                <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-2">
                  Select Recharge Amount
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCustomAmount(String(amt))}
                      className={`py-2.5 px-1 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                        customAmount === String(amt)
                          ? 'border-[#2B2644] bg-[#2B2644] text-white shadow-xs'
                          : 'border-[#2B2644]/12 bg-[#F5F6FA] text-[#141320] hover:bg-[#E9ECF6]'
                      }`}
                    >
                      +{formatINR(amt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
                  Or Enter Amount (₹)
                </label>
                <input
                  type="number"
                  min="50"
                  max="2000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 text-sm font-bold text-[#141320] outline-none focus:border-[#2B2644]"
                />
                <span className="text-[10px] text-[#64677A] mt-1 block">Maximum per single recharge: ₹2,000</span>
              </div>

              {/* Payment Channel Selection */}
              <div>
                <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedUpiApp('gpay')}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                      selectedUpiApp === 'gpay'
                        ? 'border-[#2B2644] bg-[#F5F6FA] font-bold text-[#2B2644]'
                        : 'border-[#2B2644]/12 text-[#64677A]'
                    }`}
                  >
                    <span>UPI App (GPay / PhonePe)</span>
                    <span className="text-[10px] font-mono">Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedUpiApp('sbi')}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                      selectedUpiApp === 'sbi'
                        ? 'border-[#2B2644] bg-[#F5F6FA] font-bold text-[#2B2644]'
                        : 'border-[#2B2644]/12 text-[#64677A]'
                    }`}
                  >
                    <span>State Bank Collect (SBI)</span>
                    <span className="text-[10px] font-mono">NetBanking</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#2B2644]/8">
                <Button variant="ghost" size="md" onClick={() => setIsTopUpOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleStartPayment(Number(customAmount) || 250)}
                  className="px-6"
                >
                  Proceed to Pay via UPI (+{formatINR(Number(customAmount) || 250)})
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
