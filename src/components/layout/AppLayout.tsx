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
  ChevronLeft,
  ChevronRight,
  Home,
  Wallet,
  Calendar,
  History,
  X,
  Building,
  Users,
  Coffee,
  CheckCircle2,
} from 'lucide-react'
import { useStore } from '@/data/store'
import type { UserRole } from '@/data/types'

export const AppLayout: React.FC = () => {
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
          { label: 'Fee Wallet', path: '/app/mess/wallet', icon: Wallet },
          { label: 'Gate QR Pass', path: '/app/gate', icon: QrCode },
          { label: 'Profile & ID', path: '/app/profile', icon: User },
        ]
    }
  }

  const navItems = getNavItems(currentRole)

  // Generate breadcrumb pieces
  const pathParts = location.pathname.split('/').filter(Boolean)

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
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col">
      {/* Body Wrapper with EXACT pt-16 (64px) so content never clips behind the fixed h-16 navbar */}
      <div className="flex-1 flex pt-16">
        {/* DESKTOP FIXED SIDEBAR (Visible on lg >= 1024px) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 fixed top-16 bottom-0 left-0 h-[calc(100vh-4rem)] bg-white border-r border-[rgba(43,38,68,0.08)] z-30 shadow-xs">
          {/* Persona Header Card */}
          <div className="p-5 border-b border-[rgba(43,38,68,0.06)] bg-[#F5F6FA]/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-[#2B2644] to-[#11101D] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                {currentRole === 'student' ? currentStudent.avatarInitials : currentRole.slice(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#141320] truncate">{roleInfo.title}</h4>
                </div>
                <p className="text-[11px] text-[#64677A] truncate mt-0.5">{roleInfo.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Role Navigation Items with Sliding Active Pill */}
          <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
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
                  className={`relative flex items-center gap-3 px-4 py-2.5 rounded-[16px] text-xs font-semibold transition-colors duration-150 ${
                    isActive ? 'text-white' : 'text-[#64677A] hover:text-[#141320] hover:bg-[#F5F6FA]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarPill"
                      className="absolute inset-0 bg-[#2B2644] rounded-[16px] -z-10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Quick Persona Switcher Footer */}
          <div className="p-3.5 border-t border-[rgba(43,38,68,0.06)] bg-[#F5F6FA]/40">
            <Link
              to="/login"
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-[14px] text-xs font-semibold border border-[rgba(43,38,68,0.12)] bg-white text-[#2B2644] hover:bg-[#2B2644] hover:text-white transition-all shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                <span>Switch Role</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                {roleInfo.badge}
              </span>
            </Link>
          </div>
        </aside>

        {/* MOBILE SLIDE-OVER DRAWER (Visible below 1024px) */}
        <AnimatePresence>
          {isMobileDrawerOpen && (
            <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileDrawerOpen(false)}
                className="fixed inset-0 bg-[#11101D]/40 backdrop-blur-sm"
              />

              {/* Drawer Container */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col border-r border-[rgba(43,38,68,0.08)] z-10"
              >
                <div className="p-5 border-b border-[rgba(43,38,68,0.06)] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-[12px] bg-[#2B2644] text-white flex items-center justify-center font-bold text-sm">
                      D
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#141320]">{roleInfo.title}</h4>
                      <p className="text-[10px] text-[#64677A]">{roleInfo.subtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1.5 rounded-full text-[#64677A] hover:bg-[#F5F6FA]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-[14px] text-xs font-semibold ${
                          isActive ? 'bg-[#2B2644] text-white' : 'text-[#64677A] hover:bg-[#F5F6FA]'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>

                <div className="p-4 border-t border-[rgba(43,38,68,0.06)]">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[14px] text-xs font-bold bg-[#11101D] text-white"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Role Switcher Menu</span>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT AREA: flex-1 min-w-0, lg:ml-64, generous padding */}
        <main className="flex-1 min-w-0 lg:ml-64 px-8 py-8 lg:px-10 lg:py-10 max-w-7xl mx-auto w-full">
          {/* Breadcrumbs Trail */}
          <div className="flex items-center gap-2 text-xs text-[#64677A] mb-6">
            <Link to="/" className="hover:text-[#141320] flex items-center gap-1 font-medium">
              <Home className="w-3.5 h-3.5" />
              <span>DUK Hub</span>
            </Link>
            {pathParts.map((part, index) => {
              const fullPath = `/${pathParts.slice(0, index + 1).join('/')}`
              const isLast = index === pathParts.length - 1
              return (
                <React.Fragment key={fullPath}>
                  <span>/</span>
                  {isLast ? (
                    <span className="font-semibold text-[#141320] capitalize">{part.replace('-', ' ')}</span>
                  ) : (
                    <Link to={fullPath} className="hover:text-[#141320] capitalize font-medium">
                      {part.replace('-', ' ')}
                    </Link>
                  )}
                </React.Fragment>
              )
            })}
          </div>

          {/* Animated Route View with 12px upward slide + opacity fade */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* MOBILE BOTTOM QUICK-BAR (< 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[rgba(43,38,68,0.08)] py-2 px-3 z-30 flex items-center justify-around shadow-lg">
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
