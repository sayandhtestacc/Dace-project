import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export const Footer: React.FC = () => {
  const location = useLocation()
  const isAppPortal = location.pathname.startsWith('/app') || location.pathname.startsWith('/admin')

  // In app portal, hide marketing footer to ensure clean dashboard layout
  if (isAppPortal) return null

  return (
    <footer className="w-full bg-[#F5F6FA] border-t border-slate-200/70 pt-16 pb-12 mt-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[rgba(43,38,68,0.06)]">
          {/* Brand & Institution Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[12px] bg-[#2B2644] text-white flex items-center justify-center font-bold text-base shadow-sm">
                <span>D</span>
              </div>
              <span className="font-semibold text-lg text-[#141320]">DUK Hub</span>
            </div>
            <p className="text-xs text-[#64677A] leading-relaxed max-w-sm">
              Digital University Kerala (Kerala University of Digital Sciences, Innovation and Technology), Technopark Phase IV, Mangalapuram, Thiruvananthapuram.
            </p>
            <p className="text-[11px] text-[#64677A] leading-relaxed max-w-sm">
              Built as a comprehensive demonstrator for course <strong>DACE-I</strong> (Digital Access for Community Empowerment).
            </p>
          </div>

          {/* Column 1: Modules */}
          <div>
            <h4 className="text-xs font-bold text-[#141320] uppercase tracking-wider mb-4">Modules</h4>
            <ul className="space-y-2 text-xs text-[#64677A]">
              <li>
                <Link to="/app/complaints" className="hover:text-[#141320] transition-colors">
                  Complaint Tracker
                </Link>
              </li>
              <li>
                <Link to="/app/mess" className="hover:text-[#141320] transition-colors">
                  Smart Mess
                </Link>
              </li>
              <li>
                <Link to="/app/mess/wallet" className="hover:text-[#141320] transition-colors">
                  Fee Wallet
                </Link>
              </li>
              <li>
                <Link to="/app/gate" className="hover:text-[#141320] transition-colors">
                  QR Gate Pass
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Portals */}
          <div>
            <h4 className="text-xs font-bold text-[#141320] uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2 text-xs text-[#64677A]">
              <li>
                <Link to="/app" className="hover:text-[#141320] transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#141320] transition-colors">
                  Admin Analytics
                </Link>
              </li>
              <li>
                <Link to="/app/mess-manager" className="hover:text-[#141320] transition-colors">
                  Mess Manager Desk
                </Link>
              </li>
              <li>
                <Link to="/app/security" className="hover:text-[#141320] transition-colors">
                  Security Guard Post
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div>
            <h4 className="text-xs font-bold text-[#141320] uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-xs text-[#64677A]">
              <li>
                <Link to="/login" className="hover:text-[#141320] transition-colors">
                  Role Picker
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#141320] transition-colors">
                  Privacy & Ethics Policy
                </Link>
              </li>
              <li>
                <Link to="/app/profile" className="hover:text-[#141320] transition-colors">
                  Student Digital ID
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Ethics Banner & Disclaimer */}
        <div className="py-6 border-b border-[rgba(43,38,68,0.06)]">
          <div className="p-4 rounded-[16px] bg-[#E9ECF6]/60 border border-[rgba(43,38,68,0.08)] text-xs text-[#2B2644] leading-relaxed">
            <span className="font-semibold block mb-1">Campus Ethics & Privacy Statement:</span>
            Demo uses fake data only. Gate logs record entry, exit, purpose and general destination — never live indoor location. Logs are visible only to security, warden and admin; students see only their own history. Logs auto-expire after 90 days. Anonymous complaints are supported.
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#64677A] gap-4">
          <p>© 2026 DUK Hub · DACE-I Project · Digital University Kerala</p>
          <p className="text-emerald-700 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Interactive Mock Demo Active
          </p>
        </div>
      </div>
    </footer>
  )
}
