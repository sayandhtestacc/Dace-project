import React, { useState, useEffect } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  AlertCircle,
  Utensils,
  QrCode,
  User,
  Shield,
  Calendar,
  History,
  X,
  Users,
} from 'lucide-react'
import { useStore } from '@/data/store'
import { CollegeLogo } from '@/components/ui/CollegeLogo'

export const AppLayout: React.FC = () => {
  const [showBanner, setShowBanner] = useState(true)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const location = useLocation()
  const { currentRole, currentStudentId, students } = useStore()

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0]

  // Listen for mobile sidebar toggle from navbar
  useEffect(() => {
    const handleToggle = () => setIsMobileDrawerOpen((prev) => !prev)
    window.addEventListener('toggle-mobile-sidebar', handleToggle)
    return () => window.removeEventListener('toggle-mobile-sidebar', handleToggle)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileDrawerOpen(false)
  }, [location.pathname])

  // Nav Items tailored per role
  const getNavItems = (role: string) => {
    switch (role) {
      case 'mess-manager':
        return [
          { label: 'Headcount Desk', path: '/app/mess-manager', icon: Utensils },
          { label: 'Weekly Menu', path: '/app/mess', icon: Calendar },
          { label: 'Bookings History', path: '/app/mess/history', icon: History },
          { label: 'Switch Persona', path: '/login', icon: Shield },
        ]
      case 'admin':
        return [
          { label: 'Complaints Queue', path: '/app/admin', icon: AlertCircle },
          { label: 'Analytics Summary', path: '/admin', icon: LayoutDashboard },
          { label: 'Gate Access Audit', path: '/app/security', icon: Shield },
          { label: 'Student Directory', path: '/app/profile', icon: User },
        ]
      case 'security':
        return [
          { label: 'Live Gate Console', path: '/app/security', icon: Shield },
          { label: 'On-Campus Roster', path: '/admin/gate', icon: Users },
          { label: 'Visit History Logs', path: '/app/gate/history', icon: History },
          { label: 'Switch Persona', path: '/login', icon: User },
        ]
      case 'warden':
        return [
          { label: 'Campus Overview', path: '/app/warden', icon: LayoutDashboard },
          { label: 'Complaints Inbox', path: '/app/admin', icon: AlertCircle },
          { label: 'Mess Headcounts', path: '/app/mess-manager', icon: Utensils },
          { label: 'Gate Security', path: '/app/security', icon: Shield },
        ]
      case 'student':
      default:
        return [
          { label: 'Overview', path: '/app', icon: LayoutDashboard },
          { label: 'Complaints', path: '/app/complaints', icon: AlertCircle },
          { label: 'Mess Menu', path: '/app/mess', icon: Utensils },
          { label: 'Fee Wallet', path: '/app/wallet', icon: Utensils },
          { label: 'Gate QR Pass', path: '/app/qr', icon: QrCode },
          { label: 'Profile & ID', path: '/app/profile', icon: User },
        ]
    }
  }

  const navItems = getNavItems(currentRole)

  const getRoleHeaderInfo = () => {
    switch (currentRole) {
      case 'mess-manager':
        return { title: 'Mess Manager', subtitle: 'Dining & Kitchen Desk', badge: 'Manager' }
      case 'admin':
        return { title: 'Dept Administrator', subtitle: 'Services Redressal', badge: 'Staff' }
      case 'security':
        return { title: 'Gate Security Guard', subtitle: 'Campus Barrier Post', badge: 'Security' }
      case 'warden':
        return { title: 'Campus Warden', subtitle: 'Executive Administration', badge: 'Warden' }
      default:
        return { title: currentStudent.name, subtitle: `${currentStudent.department} · Yr ${currentStudent.year}`, badge: 'Student' }
    }
  }

  const roleInfo = getRoleHeaderInfo()

  return (
    <div className="min-h-screen w-full bg-[#F5F6FA] flex flex-col">
      {/* 1. Optional Dismissible Maintenance Banner (Top of flow, NOT fixed over navbar) */}
      {showBanner && (
        <div className="w-full bg-[#11101D] text-white text-xs py-2.5 px-6 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Scheduled Maintenance: Campus Wi-Fi upgrade on Saturday, 10:30 PM – 11:30 PM.</span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-white/70 hover:text-white ml-4 text-sm font-bold cursor-pointer"
            aria-label="Dismiss banner"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Main Shell: Sidebar beside Content in standard flex flow */}
      <div className="flex flex-1 w-full">
        {/* Desktop Left Sidebar: fixed 256px width, sticky below navbar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-[#2B2644]/10 sticky top-16 h-[calc(100vh-4rem)] p-5 pb-6 justify-between overflow-y-auto">
          {/* User Persona Card */}
          <div>
            <div className="p-3.5 rounded-[16px] bg-[#F5F6FA] border border-[#2B2644]/6 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#2B2644] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  {currentRole === 'student' ? currentStudent.avatarInitials : currentRole.slice(0, 2).toUpperCase()}
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-bold text-[#141320] truncate">{roleInfo.title}</h4>
                  <p className="text-[11px] text-[#64677A] truncate mt-0.5">{roleInfo.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Role-Specific Nav Links with Sliding Active Pill */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const isExact = location.pathname === item.path
                const isSubPath =
                  item.path !== '/app' &&
                  item.path !== '/admin' &&
                  item.path !== '/login' &&
                  location.pathname.startsWith(item.path)
                const isActive = isExact || isSubPath

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`relative flex items-center gap-3 px-4 py-2.5 rounded-[16px] text-xs font-medium transition-colors duration-150 ${
                      isActive ? 'text-white font-semibold' : 'text-[#64677A] hover:text-[#141320] hover:bg-[#F5F6FA]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebarPill"
                        className="absolute inset-0 bg-[#2B2644] rounded-[16px] -z-10 shadow-xs"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Footer Card */}
          <div className="pt-4 border-t border-[#2B2644]/8 space-y-3">
            <Link
              to="/login"
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-[14px] text-xs font-medium border border-[#2B2644]/12 bg-[#F5F6FA] text-[#2B2644] hover:bg-[#2B2644] hover:text-white transition-all shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                <span>Switch Role</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#2B2644] bg-[#E9ECF6] px-1.5 py-0.5 rounded-md border border-[#2B2644]/15">
                {roleInfo.badge}
              </span>
            </Link>

            <div className="flex items-center justify-center gap-2 pt-1 opacity-70">
              <CollegeLogo size="xs" />
              <span className="text-[10px] text-[#64677A] font-semibold">DUK Campus Cloud</span>
            </div>
          </div>
        </aside>

        {/* Mobile Slide-Over Drawer (Below 1024px) */}
        <AnimatePresence>
          {isMobileDrawerOpen && (
            <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileDrawerOpen(false)}
                className="fixed inset-0 bg-[#11101D]/40 backdrop-blur-xs"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col border-r border-[#2B2644]/10 z-10 p-5 justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2B2644]/8">
                    <div className="flex items-center gap-2.5">
                      <CollegeLogo size="sm" />
                      <div>
                        <h4 className="text-xs font-bold text-[#141320]">{roleInfo.title}</h4>
                        <p className="text-[10px] text-[#64677A]">{roleInfo.subtitle}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="p-1 rounded-full text-[#64677A] hover:bg-[#F5F6FA]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <nav className="space-y-1">
                    {navItems.map((item) => {
                      const isActive = location.pathname === item.path
                      return (
                        <Link
                          key={item.label}
                          to={item.path}
                          onClick={() => setIsMobileDrawerOpen(false)}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-xs font-medium ${
                            isActive ? 'bg-[#2B2644] text-white' : 'text-[#64677A] hover:bg-[#F5F6FA]'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </nav>
                </div>

                <div className="pt-4 border-t border-[#2B2644]/8">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-xs font-medium bg-[#11101D] text-white"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Role Switcher Menu</span>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Scrollable Content Area: pb-24 prevents clipping by mobile quick-bars */}
        <main className="flex-1 min-w-0 w-full p-6 md:p-8 lg:p-10 pb-24">
          <div className="max-w-6xl mx-auto w-full space-y-8">
            {/* Pure Mount Transition with NO mode="wait" to eliminate white screens */}
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Quick-Bar (< 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#2B2644]/8 py-2 px-3 z-30 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 4).map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-medium p-1 ${
                isActive ? 'text-[#2B2644] font-bold' : 'text-[#64677A]'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
