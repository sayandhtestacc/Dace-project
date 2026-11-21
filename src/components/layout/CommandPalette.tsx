import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Compass,
  AlertCircle,
  Utensils,
  QrCode,
  Shield,
  ArrowRight,
  User,
  Plus,
  Wallet,
} from 'lucide-react'
import { useStore } from '@/data/store'
import { formatINR } from '@/lib/format'

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const { switchRole, complaints, weeklyMenu, currentStudentId, students } = useStore()

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    const handleCustomOpen = () => setIsOpen((prev) => !prev)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-command-palette', handleCustomOpen)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-command-palette', handleCustomOpen)
    }
  }, [isOpen])

  // Static action and navigation items
  const baseActions = [
    { label: 'Student Overview', path: '/app', icon: Compass, category: 'Navigation', keywords: 'home dashboard' },
    { label: 'New Complaint Wizard', path: '/app/complaints/new', icon: Plus, category: 'Actions', keywords: 'file report problem ticket' },
    { label: 'Complaint Tracker', path: '/app/complaints', icon: AlertCircle, category: 'Navigation', keywords: 'tickets status issues' },
    { label: 'Weekly Dining Menu', path: '/app/mess', icon: Utensils, category: 'Navigation', keywords: 'food breakfast lunch dinner meal booking' },
    { label: 'Fee Wallet & Top-up', path: '/app/wallet', icon: Wallet, category: 'Actions', keywords: 'balance ledger recharge pay' },
    { label: 'Gate QR Pass & Scanner', path: '/app/qr', icon: QrCode, category: 'Actions', keywords: 'security scan barrier token pass' },
    { label: 'Student Digital Profile & ID', path: '/app/profile', icon: User, category: 'Navigation', keywords: 'credentials card flip avatar' },
    { label: 'Security Gate Live Console', path: '/app/security', icon: Shield, category: 'Security Guard', keywords: 'turnstile log scanner gate admin' },
    { label: 'Admin Complaints Queue', path: '/app/admin', icon: AlertCircle, category: 'Dept Admin', keywords: 'redressal resolve assign' },
    { label: 'Mess Headcount Desk', path: '/app/mess-manager', icon: Utensils, category: 'Mess Manager', keywords: 'kitchen wastage count report' },
    { label: 'Role Switcher / Persona', path: '/login', icon: Shield, category: 'System', keywords: 'warden student admin security login' },
  ]

  // Dynamic search entries: real live complaints
  const complaintItems = complaints.slice(0, 8).map((c) => ({
    label: `Ticket #${c.refId}: ${c.title}`,
    path: `/app/complaints`,
    icon: AlertCircle,
    category: `Complaint (${c.status})`,
    keywords: `${c.refId} ${c.title} ${c.category} ${c.status}`,
  }))

  // Dynamic search entries: menu food items
  const menuItems: { label: string; path: string; icon: typeof Utensils; category: string; keywords: string }[] = []
  weeklyMenu.forEach((day) => {
    day.meals.forEach((m) => {
      m.items.forEach((item) => {
        if (!menuItems.some((existing) => existing.label.includes(item))) {
          menuItems.push({
            label: `${item} (${m.mealType} - ₹${m.price})`,
            path: '/app/mess',
            icon: Utensils,
            category: `Menu (${day.dayName})`,
            keywords: `${item} ${m.mealType} ${day.dayName}`,
          })
        }
      })
    })
  })

  const allItems = [...baseActions, ...complaintItems, ...menuItems]

  const filtered = query.trim()
    ? allItems.filter(
        (a) =>
          a.label.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase()) ||
          a.keywords.toLowerCase().includes(query.toLowerCase())
      )
    : baseActions

  // Reset index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Keyboard navigation
  const handleKeyDownInSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex])
      }
    }
  }

  const handleSelect = (item: (typeof allItems)[0]) => {
    if (item.category === 'Security Guard') {
      switchRole('security')
    } else if (item.category === 'Dept Admin') {
      switchRole('admin')
    } else if (item.category === 'Mess Manager') {
      switchRole('mess-manager')
    }
    navigate(item.path)
    setIsOpen(false)
    setQuery('')
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-start justify-center pt-20 p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[#11101D]/50 backdrop-blur-xs transition-opacity"
          />

          {/* Palette Window: centered max-w-xl w-full rounded-[24px] bg-white shadow-2xl border border-[#2B2644]/10 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-white rounded-[24px] shadow-2xl border border-[#2B2644]/10 overflow-hidden z-10"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2B2644]/8 bg-[#F5F6FA]/40">
              <Search className="w-5 h-5 text-[#64677A] shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDownInSearch}
                placeholder="Search screens, complaints, menu items, or switch roles..."
                className="w-full text-sm bg-transparent outline-none text-[#141320] placeholder-[#64677A]"
              />
              <kbd className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white border border-[#2B2644]/10 rounded-md text-[#64677A] shrink-0 shadow-2xs">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-84 overflow-y-auto p-2 divide-y divide-transparent">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#64677A]">
                  No matching results for "{query}". Try "mess", "gate", "wifi", or "dosa".
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = idx === selectedIndex
                  return (
                    <button
                      key={`${item.label}-${idx}`}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between p-3 rounded-[16px] text-left transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#2B2644] text-white' : 'hover:bg-[#F5F6FA] text-[#141320]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-[12px] flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-white/15 text-white' : 'bg-[#2B2644]/6 text-[#2B2644]'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <span className={`text-xs font-semibold block truncate ${isSelected ? 'text-white' : 'text-[#141320]'}`}>
                            {item.label}
                          </span>
                          <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-[#C9C7DA]' : 'text-[#64677A]'}`}>
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <ArrowRight
                        className={`w-3.5 h-3.5 shrink-0 transition-opacity ml-2 ${
                          isSelected ? 'opacity-100 text-white' : 'opacity-0'
                        }`}
                      />
                    </button>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-[#F5F6FA] border-t border-[#2B2644]/8 flex items-center justify-between text-[11px] text-[#64677A]">
              <div className="flex items-center gap-3">
                <span>↑↓ to navigate</span>
                <span>↵ to select</span>
              </div>
              <span className="font-semibold text-[#2B2644]">DUK Hub Spotlight</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
