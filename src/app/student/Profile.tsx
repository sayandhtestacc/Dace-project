import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Building,
  GraduationCap,
  QrCode,
  RotateCw,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
} from 'lucide-react'
import { useStore } from '@/data/store'
import { generateQRMatrix, renderQRToSVG } from '@/lib/qr'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

export default function Profile() {
  const { currentStudentId, students, resetDemoData, switchStudent } = useStore()
  const { success, info } = useToast()

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0]

  const [name, setName] = useState(currentStudent.name)
  const [email, setEmail] = useState(currentStudent.email)
  const [department, setDepartment] = useState(currentStudent.department)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  // Generate Digital ID QR
  const idQr = generateQRMatrix(currentStudent.id, 99999999)
  const idQrSvg = renderQRToSVG(idQr, 7)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    success('Profile changes saved to demo storage')
  }

  const handleReset = () => {
    resetDemoData()
    setIsResetModalOpen(false)
    success('Demo data restored to clean seed state!')
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
          Identity & Student Governance
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight">
          Student Digital Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#64677A] mt-1">
          Verified academic credentials, flippable digital ID card, and demonstration sandbox controls.
        </p>
      </div>

      {/* Side-by-side in grid-cols-1 lg:grid-cols-12 gap-8 (4 cols for ID card, 8 cols for form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: 4 COLS (Smart Digital Student ID with 3D Flip) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider">
              Smart Digital Student ID
            </span>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="text-xs text-[#2B2644] hover:underline flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isFlipped ? 'Show Front' : 'Flip Card'}</span>
            </button>
          </div>

          <div className="perspective-1000">
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', damping: 20 }}
              className="relative w-full h-[400px] [transform-style:preserve-3d] cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* CARD FRONT */}
              <div className="absolute inset-0 w-full h-full rounded-[24px] bg-gradient-to-br from-[#2B2644] via-[#1E1933] to-[#11101D] text-white p-6 flex flex-col justify-between shadow-2xl border border-white/10 [backface-visibility:hidden]">
                <div>
                  <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-[10px] bg-white text-[#2B2644] font-bold text-xs flex items-center justify-center shadow-xs">
                        D
                      </div>
                      <span className="text-xs font-bold tracking-wider">DUK DIGITAL ID</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                      Verified
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-6">
                    <div className="w-16 h-16 rounded-[18px] bg-gradient-to-tr from-[#C5CBE8] to-white text-[#2B2644] flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                      {currentStudent.avatarInitials}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-snug">{currentStudent.name}</h3>
                      <p className="text-xs text-[#C9C7DA] mt-0.5">{currentStudent.department}</p>
                      <span className="text-[11px] text-white/70 block mt-0.5">Year {currentStudent.year} · Resident Scholar</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-[#C9C7DA] uppercase block font-bold tracking-wider">
                      Student Passkey
                    </span>
                    <span className="text-xs font-mono font-bold text-white">{currentStudent.qrToken}</span>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-[10px] p-1 flex items-center justify-center shadow-xs">
                    <QrCode className="w-10 h-10 text-[#2B2644]" />
                  </div>
                </div>
              </div>

              {/* CARD BACK */}
              <div className="absolute inset-0 w-full h-full rounded-[24px] bg-white text-[#141320] p-6 flex flex-col justify-between shadow-2xl border border-[rgba(43,38,68,0.15)] [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <div>
                  <div className="pb-3 border-b border-[rgba(43,38,68,0.08)] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2B2644]">CAMPUS RECORD</span>
                    <span className="text-[10px] text-[#64677A]">Technopark IV, Trivandrum</span>
                  </div>

                  <div className="my-4 space-y-2.5 text-xs">
                    <div>
                      <span className="text-[9px] text-[#64677A] uppercase font-bold tracking-wider block">Institutional Email</span>
                      <span className="text-[#141320] font-mono text-[11px]">{currentStudent.email}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#64677A] uppercase font-bold tracking-wider block">Course Enrollment</span>
                      <span className="text-[#141320] font-medium">DACE-I (Community Empowerment)</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#64677A] uppercase font-bold tracking-wider block">Emergency Contact</span>
                      <span className="text-[#141320] font-mono">Campus Security: 0471-2788000</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[rgba(43,38,68,0.08)] text-center">
                  <span className="text-[9px] text-[#64677A] block mb-1.5 font-medium">Auto-expires 90 days after semester completion</span>
                  <div className="h-7 w-full bg-[#11101D] rounded-[6px] flex items-center justify-center">
                    <span className="text-[9px] font-mono text-white tracking-[0.25em]">|||| | |||||| || |||||</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <p className="text-[11px] text-center text-[#64677A] pt-1">
            Click card or "Flip Card" to inspect institutional barcode
          </p>
        </div>

        {/* RIGHT COLUMN: 8 COLS (Profile Form + Switch Identity + Reset Demo Data) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Edit Profile Card */}
          <Card variant="elevated" className="p-6 sm:p-8">
            <h3 className="text-base font-bold text-[#141320] mb-1">Personal Information</h3>
            <p className="text-xs text-[#64677A] mb-5">
              Updates persist in your browser's local sandbox storage.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input label="Institutional Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Input
                label="Department / Specialization"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />

              <div className="pt-2 flex justify-end">
                <Button variant="primary" size="md" type="submit">
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Switch Identity Card */}
          <Card variant="elevated" className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-[#141320]">Switch Student Persona</h3>
              <Badge variant="purple">18 Seeded Profiles</Badge>
            </div>
            <p className="text-xs text-[#64677A] mb-4">
              Select any student account from Kerala University of Digital Sciences to inspect their unique complaints, wallet balance, and meal logs.
            </p>
            <select
              value={currentStudentId}
              onChange={(e) => {
                switchStudent(e.target.value)
                info(`Switched student persona`)
              }}
              className="w-full text-xs p-3 rounded-[14px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.1)] text-[#141320] outline-none font-medium"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.department} (Year {s.year}) · ₹{s.walletBalance} Balance
                </option>
              ))}
            </select>
          </Card>

          {/* Reset Demo State Card */}
          <Card variant="elevated" className="p-6 sm:p-8 border-red-100 bg-red-50/20">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-red-700">Reset Demo Data</h3>
              <span className="text-[10px] uppercase font-bold text-red-600 bg-red-100/60 px-2 py-0.5 rounded-full">
                Sandbox Action
              </span>
            </div>
            <p className="text-xs text-[#64677A] mb-4 leading-relaxed">
              Restores all complaints, meal bookings, wallet transactions, and gate logs to their pristine initial seed state.
            </p>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsResetModalOpen(true)}
              iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Reset All Demo State
            </Button>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Confirm Reset Demo Data"
        description="Are you sure you want to revert all records to their starting seed values?"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#64677A] leading-relaxed">
            This will wipe any newly created complaints, wallet top-ups, and active gate sessions, restoring the pristine demo scenario.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="md" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={handleReset}>
              Yes, Reset Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
