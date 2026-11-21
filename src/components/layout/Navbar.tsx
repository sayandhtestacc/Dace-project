import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Command, ArrowRight, Shield } from 'lucide-react'
import { NotificationCenter } from '@/components/ui/NotificationCenter'
import { useStore } from '@/data/store'

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { currentRole } = useStore()

  const isAppPortal = location.pathname.startsWith('/app') || location.pathname.startsWith('/admin')

  const navLinks = [
    { label: 'Product', href: '#product' },
    { label: 'Modules', href: '#modules' },
    { label: 'Impact', href: '#impact' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'App Portal', href: '/app' },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      if (location.pathname !== '/') {
        navigate(`/${href}`)
      } else {
        const el = document.querySelector(href)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }
      setIsMobileMenuOpen(false)
    } else {
      setIsMobileMenuOpen(false)
    }
  }

  const handleOpenCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
  }

  const handleToggleMobileSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))
  }

  return (
    <header className="sticky top-0 z-40 h-16 w-full shrink-0 bg-[#F5F6FA]/85 backdrop-blur-md border-b border-[#2B2644]/8">
      <div className="max-w-[1200px] h-full mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Left: Mobile Sidebar Toggle (inside /app) + Geometric Monogram & Brand */}
        <div className="flex items-center gap-3">
          {isAppPortal && (
            <button
              onClick={handleToggleMobileSidebar}
              className="lg:hidden p-2 rounded-full text-[#141320] hover:bg-[#2B2644]/6 cursor-pointer"
              aria-label="Toggle Portal Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-[12px] bg-[#2B2644] text-white flex items-center justify-center font-bold text-base shadow-sm transition-transform duration-200 group-hover:scale-105">
              <span className="bg-gradient-to-tr from-[#C5CBE8] to-white bg-clip-text text-transparent">D</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base tracking-tight text-[#141320] leading-none">
                DUK Hub
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#64677A] font-bold mt-0.5">
                Campus Services
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links (when not in app portal) */}
        {!isAppPortal && (
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isCurrent = location.pathname === link.href
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm font-medium tracking-wide transition-colors hover:text-[#141320] ${
                    isCurrent ? 'text-[#141320]' : 'text-[#64677A]'
                  }`}
                >
                  {link.label}
                </a>
              )
            })}
          </nav>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications Center */}
          <NotificationCenter />

          {/* Quick Command Hint: Search pill (Search ⌘K with px-4 py-2) */}
          <button
            onClick={handleOpenCommandPalette}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2B2644]/6 hover:bg-[#2B2644]/10 text-[#64677A] hover:text-[#141320] text-xs font-medium transition-colors cursor-pointer"
            title="Press Cmd+K to search"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white rounded-md font-mono border border-black/10">
              ⌘K
            </kbd>
          </button>

          {/* Open Demo dark pill: bg-[#2B2644] text-white px-5 py-2.5 rounded-full */}
          {!isAppPortal ? (
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium rounded-full bg-[#2B2644] text-white hover:bg-[#11101D] active:scale-[0.98] transition-all shadow-sm"
            >
              <span>Open Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full border border-[#2B2644]/15 bg-white text-[#2B2644] hover:bg-[#2B2644] hover:text-white transition-all shadow-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Persona</span>
            </Link>
          )}

          {/* Mobile Menu Button for Landing Page */}
          {!isAppPortal && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-[#141320] hover:bg-[#2B2644]/6"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer (Landing) */}
      <AnimatePresence>
        {!isAppPortal && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-b border-[#2B2644]/8 px-6 py-4 overflow-hidden shadow-lg"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="py-2 text-sm font-medium text-[#141320] border-b border-[#2B2644]/4"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-medium rounded-full border border-[#2B2644]/15 text-[#141320]"
                >
                  Switch Role / Login
                </Link>
                <Link
                  to="/app"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-medium rounded-full bg-[#11101D] text-white"
                >
                  Enter Portal
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
