import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Utensils,
  QrCode,
  Sparkles,
  CheckCircle,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CollegeLogo } from '@/components/ui/CollegeLogo'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#141320] overflow-x-hidden">
      {/* ─── HERO SECTION (pt-6 pb-16) ─── */}
      <section className="pt-6 pb-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 w-full">
          <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#E9ECF6] via-[#DCE1F4] to-[#C5CBE8] border border-[#2B2644]/10 px-8 py-16 md:py-24 text-center shadow-[0_24px_60px_-24px_rgba(43,38,68,0.2)]">
            {/* Subtle Ambient Background Blobs */}
            <div className="absolute top-0 right-10 w-96 h-96 bg-purple-300/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-96 h-96 bg-indigo-300/25 rounded-full blur-3xl pointer-events-none" />

            {/* Strictly Centered Hero Content */}
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              {/* College Logo & Eyebrow Pill */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#2B2644]/10 text-[#2B2644] text-xs font-semibold mb-6 shadow-xs"
              >
                <CollegeLogo size="xs" />
                <span>DACE-I Student Innovation Showcase · Digital University Kerala</span>
              </motion.div>

              {/* H1 Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="text-4xl md:text-6xl font-medium tracking-[-0.03em] text-[#141320] leading-[1.1]"
              >
                One campus. Three problems. <br />
                <span className="bg-gradient-to-r from-[#2B2644] to-[#11101D] bg-clip-text text-transparent font-semibold">
                  One unified platform.
                </span>
              </motion.h1>

              {/* Centered 2-line subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.16 }}
                className="max-w-2xl mx-auto mt-5 text-base sm:text-lg text-[#64677A] leading-relaxed"
              >
                DUK Hub replaces paper gate registers, uncounted mess food waste, and untracked WhatsApp complaints with an instantaneous, role-based student and campus administration portal.
              </motion.p>

              {/* Centered CTA Row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24 }}
                className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link
                  to="/app"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm sm:text-base font-semibold rounded-full bg-[#11101D] text-white hover:bg-[#2B2644] active:scale-[0.98] transition-all shadow-[0_12px_32px_rgba(17,16,29,0.25)] group cursor-pointer"
                >
                  <span>Launch the demo</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-full bg-white/80 hover:bg-white text-[#141320] border border-[#2B2644]/12 active:scale-[0.98] transition-all shadow-xs"
                >
                  <span>Role Switcher</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE CAMPUS CHALLENGE (2-Col Split, py-16 md:py-24) ─── */}
      <section className="py-16 md:py-24" id="product">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column (5 cols) */}
            <div className="lg:col-span-5">
              <span className="text-xs font-bold text-[#64677A] tracking-wider uppercase block mb-2">
                The Campus Challenge
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal text-[#141320] tracking-[-0.02em] leading-tight mb-6">
                Rethinking daily friction points for 1,200+ residential scholars.
              </h2>
              <Link
                to="/app"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2B2644] text-white text-sm font-medium hover:bg-[#11101D] active:scale-[0.98] transition-all mt-6 shadow-sm"
              >
                <span>Explore Interactive Modules</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right Column (7 cols) */}
            <div className="lg:col-span-7">
              <p className="text-lg text-[#64677A] leading-relaxed">
                Digital University Kerala operates 24/7 with specialized research labs, academic blocks, and residential complexes. Yet key student touchpoints remained manual, creating unaccounted food waste, slow maintenance resolution, and physical logbook bottlenecks at the campus gate.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-[#2B2644]/10">
                <div>
                  <span className="block text-3xl font-bold text-[#141320]">100%</span>
                  <span className="text-xs text-[#64677A] mt-1 block">Client-side persistence & privacy</span>
                </div>
                <div>
                  <span className="block text-3xl font-bold text-[#141320]">30s</span>
                  <span className="text-xs text-[#64677A] mt-1 block">Cryptographic gate QR turnover</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3-CARD ASYMMETRIC BENTO GRID (py-12) ─── */}
      <section className="py-12" id="modules">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 w-full">
          <div className="mb-8">
            <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
              Three Core Modules
            </span>
            <h3 className="text-2xl sm:text-3xl font-medium text-[#141320] tracking-tight">
              Designed for instant student utility and transparent administration.
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {/* Card 1: Wide Left (spans 2 cols) */}
            <Link to="/app/complaints" className="lg:col-span-2 block group">
              <Card
                variant="gradient"
                tilt
                className="min-h-[300px] p-7 rounded-[24px] flex flex-col justify-between relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="purple">
                      Module A
                    </Badge>
                    <ArrowRight className="w-5 h-5 text-[#2B2644] transition-transform group-hover:translate-x-1" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#141320]">Complaint Tracker</h3>
                  <p className="text-xs text-[#64677A] mt-2 max-w-sm leading-relaxed">
                    Transparent lifecycle from submission to department assignment and resolution. Includes anonymous mode and satisfaction scoring.
                  </p>
                </div>

                <div className="relative z-10 pt-4">
                  <span className="text-xs font-semibold text-[#2B2644] underline underline-offset-4">
                    Open Tracker →
                  </span>
                </div>
              </Card>
            </Link>

            {/* Card 2: Middle (1 col) */}
            <Link to="/app/mess" className="lg:col-span-1 block group">
              <Card
                variant="dark"
                spotlight
                tilt
                className="min-h-[300px] p-7 rounded-[24px] flex flex-col justify-between bg-[#2B2644] text-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="neutral" className="bg-white/10 text-white border-white/20">
                      Module B
                    </Badge>
                    <Utensils className="w-4 h-4 text-[#C9C7DA]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Smart Mess</h3>
                  <p className="text-xs text-[#C9C7DA] mt-2 leading-relaxed">
                    Daily meal booking with automated cutoffs (8 PM) and internal fee ledger refunds.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <span className="text-xs font-medium text-white block mb-0.5">
                    Zero Food Waste
                  </span>
                  <span className="text-[11px] text-[#C9C7DA]">Next cutoff: 8:00 PM</span>
                </div>
              </Card>
            </Link>

            {/* Card 3: Right (1 col) */}
            <Link to="/app/qr" className="lg:col-span-1 block group">
              <Card
                variant="dark"
                spotlight
                tilt
                className="min-h-[300px] p-7 rounded-[24px] flex flex-col justify-between bg-[#2B2644] text-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="neutral" className="bg-white/10 text-white border-white/20">
                      Module C
                    </Badge>
                    <QrCode className="w-4 h-4 text-[#C9C7DA]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">QR Gate Log</h3>
                  <p className="text-xs text-[#C9C7DA] mt-2 leading-relaxed">
                    30-second deterministic QR refresh with real-time on-campus headcount tracking.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <span className="text-xs font-medium text-[#C5CBE8] block mb-0.5">
                    30s Live Token
                  </span>
                  <span className="text-[11px] text-[#C9C7DA]">Zero paper registers</span>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF / PARTNER STRIP (py-10) ─── */}
      <section className="py-10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 w-full">
          <div className="flex justify-between items-center flex-wrap gap-6 border-y border-[#2B2644]/8 py-6">
            <div className="shrink-0 flex items-center gap-3">
              <CollegeLogo size="sm" />
              <div>
                <p className="text-xs font-bold text-[#141320] uppercase tracking-wider">
                  Digital University Kerala
                </p>
                <p className="text-[11px] text-[#64677A]">DACE-I Innovation Showcase 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-8 md:gap-12 opacity-65 flex-wrap">
              {['DUK', 'KSUM', 'IIITMK', 'Digital Kerala', 'NASSCOM', 'K-DISC'].map((partner) => (
                <span
                  key={partner}
                  className="font-bold text-sm tracking-wider text-[#2B2644] select-none hover:opacity-100 transition-opacity"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── UNIFIED CAMPUS DASHBOARD PREVIEW (py-16 md:py-24) ─── */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column (5 cols) */}
            <div className="lg:col-span-5">
              <Badge variant="purple" className="mb-3">
                PLATFORM ARCHITECTURE
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-normal text-[#141320] tracking-[-0.02em] leading-tight mb-4">
                Designed for role-based speed and absolute accountability.
              </h2>
              <p className="text-sm text-[#64677A] leading-relaxed mb-6">
                Every persona sees exactly what they need. Students track their own complaints and meal ledger; mess managers get tomorrow's exact food quantities; security guards audit live entries without paper books.
              </p>

              <ul className="space-y-3 text-xs text-[#141320] font-medium">
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#2B2644] shrink-0" />
                  <span>Instant 1-click role switching for committee evaluation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#2B2644] shrink-0" />
                  <span>Zero external dependencies or CDNs that could fail during demo</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#2B2644] shrink-0" />
                  <span>Pre-seeded with 18 realistic Kerala student profiles</span>
                </li>
              </ul>
            </div>

            {/* Right Column (7 cols): Elevated pure white card */}
            <div className="lg:col-span-7">
              <Card variant="elevated" className="bg-white rounded-[24px] p-7 shadow-sm border border-[#2B2644]/8">
                <div className="flex items-start justify-between pb-6 border-b border-[#2B2644]/8">
                  <div>
                    <h3 className="text-lg font-semibold text-[#141320]">Unified Campus Dashboard</h3>
                    <p className="text-xs text-[#64677A] mt-0.5">
                      Synchronized across local storage without server downtime risk.
                    </p>
                  </div>
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2B2644] hover:underline"
                  >
                    <span>Admin View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Cleanly spaced 3-column KPI strip */}
                <div className="mt-6 p-5 rounded-[18px] bg-[#F5F6FA] border border-[#2B2644]/8">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white p-3.5 rounded-[12px] border border-[#2B2644]/6">
                      <span className="text-[10px] text-[#64677A] uppercase font-bold block">Open Tickets</span>
                      <span className="text-base font-bold text-[#141320] mt-0.5 block">7 Active</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-[12px] border border-[#2B2644]/6">
                      <span className="text-[10px] text-[#64677A] uppercase font-bold block">Lunch Booked</span>
                      <span className="text-base font-bold text-[#2B2644] mt-0.5 block">142 Meals</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-[12px] border border-[#2B2644]/6">
                      <span className="text-[10px] text-[#64677A] uppercase font-bold block">On Campus</span>
                      <span className="text-base font-bold text-[#2B2644] mt-0.5 block">9 Active</span>
                    </div>
                  </div>

                  <div className="h-14 rounded-[12px] bg-gradient-to-r from-[#E9ECF6] to-[#C5CBE8] flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2B2644] animate-pulse" />
                      <span className="text-xs font-semibold text-[#2B2644]">Live Verification Gate Stream</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#2B2644]/80">GATE-01 · ACTIVE</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DARK STATS PILL BAR (my-12): De-AI polish with pure white / soft lavender Zero ─── */}
      <section className="my-12" id="impact">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 w-full">
          <div className="bg-[#2B2644] text-white rounded-[28px] px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center shadow-lg">
            <div>
              <span className="block text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2">
                18+
              </span>
              <span className="text-xs text-[#C9C7DA] uppercase tracking-wider font-semibold">
                Seeded Student Profiles
              </span>
            </div>

            <div className="md:border-x md:border-white/10">
              <span className="block text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2">
                3
              </span>
              <span className="text-xs text-[#C9C7DA] uppercase tracking-wider font-semibold">
                Functional Modules
              </span>
            </div>

            <div>
              <span className="block text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2">
                Zero
              </span>
              <span className="text-xs text-[#C9C7DA] uppercase tracking-wider font-semibold">
                Food Waste Target
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WALKTHROUGH CTA (py-16) ─── */}
      <section className="py-16 text-center">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 w-full">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-medium text-[#141320] tracking-[-0.02em]">
              Ready to experience the 5-minute DACE-I evaluation walkthrough?
            </h2>
            <p className="text-sm text-[#64677A] leading-relaxed">
              Follow the live demo script: file a complaint, switch to admin to resolve it, book tomorrow's lunch, and generate your 30s security gate QR.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Link
                to="/app?tour=1"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#11101D] text-white font-medium hover:bg-[#2B2644] shadow-md active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Start 5-Minute Walkthrough</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
