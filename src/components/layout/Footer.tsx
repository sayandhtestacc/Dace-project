import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CollegeLogo } from '@/components/ui/CollegeLogo'

export const Footer: React.FC = () => {
  const location = useLocation()
  const isAppPortal = location.pathname.startsWith('/app') || location.pathname.startsWith('/admin')

  // In app portal, hide marketing footer to ensure clean dashboard layout
  if (isAppPortal) return null

  return (
    <footer className="w-full bg-[#F5F6FA] border-t border-[#2B2644]/10 pt-14 pb-10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2B2644]/8">
          {/* Column 1: Brand & Institution Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CollegeLogo size="sm" />
              <div className="flex flex-col">
                <span className="font-semibold text-lg text-[#141320] leading-none">DUK Hub</span>
                <span className="text-[10px] text-[#64677A] font-semibold mt-0.5">Digital University Kerala</span>
              </div>
            </div>
            <p className="text-xs text-[#64677A] leading-relaxed">
              Digital University Kerala (Kerala University of Digital Sciences, Innovation and Technology), Technopark Phase IV, Trivandrum.
            </p>
            <p className="text-[11px] text-[#64677A] leading-relaxed">
              DACE-I Student Innovation Showcase · Client-Side Demonstrator
            </p>
          </div>

          {/* Column 2: Modules */}
          <div>
            <h4 className="text-xs font-bold text-[#141320] uppercase tracking-wider mb-4">Modules</h4>
            <ul className="space-y-2.5 text-xs text-[#64677A]">
              <li>
                <Link to="/app/complaints" className="hover:text-[#141320] transition-colors">
                  Complaint Tracker
                </Link>
              </li>
              <li>
                <Link to="/app/mess" className="hover:text-[#141320] transition-colors">
                  Smart Mess Headcount
                </Link>
              </li>
              <li>
                <Link to="/app/mess/wallet" className="hover:text-[#141320] transition-colors">
                  Mess Fee Wallet
                </Link>
              </li>
              <li>
                <Link to="/app/gate" className="hover:text-[#141320] transition-colors">
                  Security QR Gate Pass
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals */}
          <div>
            <h4 className="text-xs font-bold text-[#141320] uppercase tracking-wider mb-4">Dashboards</h4>
            <ul className="space-y-2.5 text-xs text-[#64677A]">
              <li>
                <Link to="/app" className="hover:text-[#141320] transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link to="/app/mess-manager" className="hover:text-[#141320] transition-colors">
                  Kitchen Manager Desk
                </Link>
              </li>
              <li>
                <Link to="/app/admin" className="hover:text-[#141320] transition-colors">
                  Department Admin
                </Link>
              </li>
              <li>
                <Link to="/app/security" className="hover:text-[#141320] transition-colors">
                  Gate Security Guard
                </Link>
              </li>
              <li>
                <Link to="/app/warden" className="hover:text-[#141320] transition-colors">
                  Warden / Super Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Ethics & Platform */}
          <div>
            <h4 className="text-xs font-bold text-[#141320] uppercase tracking-wider mb-4">Ethics & Policies</h4>
            <ul className="space-y-2.5 text-xs text-[#64677A]">
              <li>
                <Link to="/privacy" className="hover:text-[#141320] transition-colors">
                  Privacy & Data Governance
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#141320] transition-colors">
                  Role Picker Matrix
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
        <div className="py-6 border-b border-[#2B2644]/8">
          <div className="p-4 rounded-[16px] bg-[#E9ECF6]/60 border border-[#2B2644]/8 text-xs text-[#2B2644] leading-relaxed">
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
