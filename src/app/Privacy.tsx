import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Lock, EyeOff, Trash2, ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#141320] pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#64677A] hover:text-[#141320] mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing</span>
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9ECF6] text-[#2B2644] text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Course Ethics Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#141320]">
            Privacy, Ethics & Data Governance
          </h1>
          <p className="text-sm text-[#64677A] mt-2">
            Clear commitments regarding student information for the Digital University Kerala DACE-I Demo.
          </p>
        </div>

        {/* Highlights */}
        <div className="space-y-6">
          <Card variant="elevated" className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-[#2B2644] text-white shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#141320]">Fictitious & Seeded Data Only</h3>
                <p className="text-xs text-[#64677A] mt-1.5 leading-relaxed">
                  All names, email addresses, wallet transactions, and entry logs within this demonstration are generated exclusively for academic review. No live student database or payment gateway credentials are integrated.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-emerald-700 text-white shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#141320]">Gate Log Boundaries</h3>
                <p className="text-xs text-[#64677A] mt-1.5 leading-relaxed">
                  The gate system logs general point of entry, exit, declared destination (e.g., Library, Lab), and broad purpose. It does not perform real-time indoor localization, biometric face tracking, or continuous movement monitoring.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-[#11101D] text-white shrink-0">
                <EyeOff className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#141320]">Anonymous Complaint Protection</h3>
                <p className="text-xs text-[#64677A] mt-1.5 leading-relaxed">
                  Students may file grievances with the anonymous toggle enabled. While the administration sees category and details to resolve the issue, student identification attributes are cryptographically suppressed.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-amber-600 text-white shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#141320]">Automated 90-Day Retention Limit</h3>
                <p className="text-xs text-[#64677A] mt-1.5 leading-relaxed">
                  Entry and exit registers auto-expire after 90 days. Students can inspect and download their personal visit history at any time through their student portal.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 rounded-[20px] bg-[#E9ECF6]/60 border border-[rgba(43,38,68,0.08)] text-xs text-[#2B2644] leading-relaxed">
          <p className="font-semibold mb-1">DACE-I Course Reference:</p>
          Digital Access for Community Empowerment (DACE-I), Digital University Kerala, Trivandrum. Course project focused on community-aligned digital accessibility without surveillance overreach.
        </div>
      </div>
    </div>
  )
}
