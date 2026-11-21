import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, UserCheck, Utensils, Users, Building, ChevronDown, Check } from 'lucide-react'
import { useStore } from '@/data/store'
import type { UserRole } from '@/data/types'
import { useToast } from '@/components/ui/Toast'

export const RoleSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { currentRole, currentStudentId, switchRole, switchStudent, students } = useStore()
  const { success } = useToast()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const roles: {
    id: UserRole
    label: string
    icon: React.FC<{ className?: string }>
    desc: string
    dest: string
  }[] = [
    {
      id: 'student',
      label: 'Student',
      icon: UserCheck,
      desc: 'Raise complaints, book meals, QR pass',
      dest: '/app',
    },
    {
      id: 'mess-manager',
      label: 'Mess Manager',
      icon: Utensils,
      desc: 'Headcount & mark meals served',
      dest: '/app/mess-manager',
    },
    {
      id: 'admin',
      label: 'Dept Staff / Admin',
      icon: Building,
      desc: 'Assign & resolve complaints',
      dest: '/app/admin',
    },
    {
      id: 'security',
      label: 'Security Guard',
      icon: Shield,
      desc: 'Gate entry verification & passes',
      dest: '/app/security',
    },
    {
      id: 'warden',
      label: 'Warden / Super Admin',
      icon: Users,
      desc: 'Overall campus metrics',
      dest: '/app/warden',
    },
  ]

  const activeRoleObj = roles.find((r) => r.id === currentRole) || roles[0]

  const handleSelectRole = (r: (typeof roles)[0]) => {
    switchRole(r.id)
    setIsOpen(false)
    success(`Persona Switched: ${r.label}`)
    navigate(r.dest)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Toggle Pill */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-[#11101D] text-white rounded-full shadow-[0_8px_32px_rgba(17,16,29,0.35)] hover:bg-[#2B2644] active:scale-95 transition-all cursor-pointer border border-white/10"
          aria-label="Switch demo role"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <activeRoleObj.icon className="w-4 h-4 text-[#C5CBE8]" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-[#C9C7DA] leading-none uppercase tracking-wider font-bold">
              DEMO ROLE
            </span>
            <span className="text-xs font-semibold text-white leading-tight">
              {activeRoleObj.label}
            </span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-[#C9C7DA] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              className="absolute bottom-full right-0 mb-3 w-80 bg-white rounded-[24px] shadow-2xl border border-[rgba(43,38,68,0.12)] p-4 overflow-hidden z-50"
            >
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[rgba(43,38,68,0.06)]">
                <span className="text-xs font-bold text-[#141320] uppercase tracking-wider">
                  Switch Persona
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Instant Navigation
                </span>
              </div>

              <div className="space-y-1.5">
                {roles.map((r) => {
                  const isSelected = r.id === currentRole
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleSelectRole(r)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-[16px] text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#2B2644] text-white shadow-xs'
                          : 'hover:bg-[#F5F6FA] text-[#141320]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white/10 text-white' : 'bg-[rgba(43,38,68,0.06)] text-[#2B2644]'
                          }`}
                        >
                          <r.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold leading-tight">{r.label}</div>
                          <div
                            className={`text-[10px] ${
                              isSelected ? 'text-[#C9C7DA]' : 'text-[#64677A]'
                            }`}
                          >
                            {r.desc}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  )
                })}
              </div>

              {/* Student Identity selector when in Student mode */}
              {currentRole === 'student' && (
                <div className="mt-3 pt-3 border-t border-[rgba(43,38,68,0.06)]">
                  <label className="text-[10px] font-bold text-[#64677A] uppercase tracking-wider block mb-1">
                    Student Persona ({students.length} Kerala Profiles)
                  </label>
                  <select
                    value={currentStudentId}
                    onChange={(e) => {
                      switchStudent(e.target.value)
                      success(`Identity switched`)
                    }}
                    className="w-full text-xs p-2 rounded-[12px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.1)] text-[#141320] outline-none"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.department}, Yr {s.year})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
