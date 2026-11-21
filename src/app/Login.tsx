import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, UserCheck, Utensils, Users, Building, ArrowRight, Check } from 'lucide-react'
import { useStore } from '@/data/store'
import type { UserRole } from '@/data/types'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export default function Login() {
  const navigate = useNavigate()
  const { currentRole, currentStudentId, switchRole, switchStudent, students } = useStore()
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole as UserRole)
  const [selectedStudent, setSelectedStudent] = useState<string>(currentStudentId)
  const { success } = useToast()

  const roles = [
    {
      id: 'student' as UserRole,
      title: 'Student Portal',
      desc: 'Raise complaints, book meals with refund cutoffs, show 30s rotating gate QR.',
      icon: UserCheck,
      dest: '/app',
    },
    {
      id: 'mess-manager' as UserRole,
      title: 'Mess Manager Desk',
      desc: 'View tomorrow’s exact meal headcounts, mark meals served, audit food waste KPI.',
      icon: Utensils,
      dest: '/admin/mess',
    },
    {
      id: 'admin' as UserRole,
      title: 'Department Admin',
      desc: 'Triage, assign complaints to IT/Hostel/Academic depts, mark tickets resolved.',
      icon: Building,
      dest: '/admin/complaints',
    },
    {
      id: 'security' as UserRole,
      title: 'Security Gate Post',
      desc: 'Monitor live campus occupancy, simulate gate scans, issue visitor passes.',
      icon: Shield,
      dest: '/admin/gate',
    },
    {
      id: 'warden' as UserRole,
      title: 'Warden / Super Admin',
      desc: 'Consolidated campus overview, analytical charts, resolution turnaround times.',
      icon: Users,
      dest: '/admin',
    },
  ]

  const handleEnter = () => {
    switchRole(selectedRole)
    if (selectedRole === 'student') {
      switchStudent(selectedStudent)
    }
    const targetObj = roles.find((r) => r.id === selectedRole)
    success(`Entered as ${targetObj?.title}`)
    navigate(targetObj?.dest || '/app')
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#141320] flex items-center justify-center p-6 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-[28px] p-8 sm:p-12 border border-[rgba(43,38,68,0.08)] shadow-[0_24px_60px_-24px_rgba(43,38,68,0.2)]"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-[16px] bg-[#2B2644] text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
            <span>D</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320]">
            Select Persona to Enter Demo
          </h1>
          <p className="text-xs sm:text-sm text-[#64677A] mt-2 max-w-md mx-auto">
            This demo uses simulated roles and fake data. Choose any persona to explore that user’s workflow.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="space-y-3 mb-6">
          {roles.map((r) => {
            const isSelected = selectedRole === r.id
            return (
              <div
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`p-4 rounded-[20px] border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-[#2B2644] bg-[#F5F6FA] shadow-xs'
                    : 'border-[rgba(43,38,68,0.08)] hover:bg-[#F5F6FA]/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-[#2B2644] text-white' : 'bg-[rgba(43,38,68,0.06)] text-[#2B2644]'
                    }`}
                  >
                    <r.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#141320]">{r.title}</h4>
                    <p className="text-xs text-[#64677A] mt-0.5">{r.desc}</p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-[#2B2644] bg-[#2B2644] text-white' : 'border-[rgba(43,38,68,0.2)]'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
              </div>
            )
          })}
        </div>

        {/* Student Selector if student selected */}
        {selectedRole === 'student' && (
          <div className="mb-8 p-4 rounded-[18px] bg-[#E9ECF6]/50 border border-[rgba(43,38,68,0.08)]">
            <label className="text-xs font-bold text-[#2B2644] uppercase tracking-wider block mb-1.5">
              Select Student Identity (Demo)
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full text-sm p-3 rounded-[12px] bg-white border border-[rgba(43,38,68,0.1)] text-[#141320] outline-none"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.department} (Year {s.year}) · ₹{s.walletBalance} Balance
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Enter Button */}
        <Button
          onClick={handleEnter}
          variant="primary"
          size="lg"
          className="w-full"
          iconRight={<ArrowRight className="w-4 h-4" />}
        >
          Enter Demo Portal
        </Button>
      </motion.div>
    </div>
  )
}
