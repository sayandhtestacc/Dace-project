import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Compass, AlertCircle, Utensils, QrCode, Shield, ArrowRight, User } from 'lucide-react'
import { useStore } from '@/data/store'

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { switchRole } = useStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const actions = [
    { label: 'Student Dashboard', path: '/app', icon: Compass, category: 'Navigation' },
    { label: 'New Complaint Wizard', path: '/app/complaints/new', icon: AlertCircle, category: 'Actions' },
    { label: 'My Complaints', path: '/app/complaints', icon: AlertCircle, category: 'Navigation' },
    { label: 'Weekly Mess Menu', path: '/app/mess', icon: Utensils, category: 'Navigation' },
    { label: 'Mess Fee Wallet & Top-up', path: '/app/mess/wallet', icon: Utensils, category: 'Actions' },
    { label: 'Gate QR Pass', path: '/app/gate', icon: QrCode, category: 'Actions' },
    { label: 'Gate Visit History', path: '/app/gate/history', icon: QrCode, category: 'Navigation' },
    { label: 'Student Digital Profile', path: '/app/profile', icon: User, category: 'Navigation' },
    { label: 'Admin Summary & Analytics', path: '/admin', icon: Shield, category: 'Admin' },
    { label: 'Admin Complaint Inbox', path: '/admin/complaints', icon: AlertCircle, category: 'Admin' },
    { label: 'Mess Headcount Manager', path: '/admin/mess', icon: Utensils, category: 'Admin' },
    { label: 'Security Gate Live Log', path: '/admin/gate', icon: Shield, category: 'Admin' },
  ]

  const filtered = query
    ? actions.filter(
        (a) =>
          a.label.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      )
    : actions

  const handleSelect = (item: (typeof actions)[0]) => {
    if (item.category === 'Admin') {
      switchRole('admin')
    }
    navigate(item.path)
    setIsOpen(false)
    setQuery('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[#11101D]/50 backdrop-blur-xs"
          />

          {/* Palette Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-white rounded-[24px] shadow-2xl border border-[rgba(43,38,68,0.12)] overflow-hidden z-10"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(43,38,68,0.06)]">
              <Search className="w-5 h-5 text-[#64677A]" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or jump to page... (Esc to close)"
                className="w-full text-sm bg-transparent outline-none text-[#141320] placeholder-[#64677A]"
              />
              <kbd className="text-[11px] font-mono px-2 py-0.5 bg-[rgba(43,38,68,0.06)] rounded-sm text-[#64677A]">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#64677A]">
                  No matching screens or actions.
                </div>
              ) : (
                filtered.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSelect(item)}
                    className="w-full flex items-center justify-between p-3 rounded-[14px] hover:bg-[#F5F6FA] text-left transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[rgba(43,38,68,0.06)] flex items-center justify-center text-[#2B2644] group-hover:bg-[#2B2644] group-hover:text-white transition-colors">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-[#141320] group-hover:text-[#2B2644]">
                          {item.label}
                        </span>
                        <span className="block text-[11px] text-[#64677A]">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#64677A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 bg-[#F5F6FA] border-t border-[rgba(43,38,68,0.06)] flex items-center justify-between text-[11px] text-[#64677A]">
              <span>Use Enter to navigate</span>
              <span>DUK Hub Command Launcher</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
