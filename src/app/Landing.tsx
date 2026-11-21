import React, { useState } from 'react'
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
  TrendingUp,
  Clock,
  Layers,
  ChevronRight,
  Users,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#141320] pt-20 pb-20 overflow-hidden">
      {/* 5.2 HERO SECTION (Contained Rounded Card with mt-6, max-w-[1200px], generous padding) */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 pt-4 pb-12">
        <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-b from-[#E9ECF6] via-[#DCE1F2] to-[#C5CBE8] border border-[rgba(43,38,68,0.12)] px-8 py-16 md:py-24 shadow-[0_24px_60px_-24px_rgba(43,38,68,0.28)] mt-2">
          {/* Animated Ambient Blobs */}
          <div className="absolute top-0 right-10 w-96 h-96 bg-purple-300/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-10 left-10 w-96 h-96 bg-indigo-300/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

          {/* Floating Geometric SVGs */}
          <div className="absolute top-10 left-10 opacity-30 pointer-events-none hidden sm:block animate-bounce [animation-duration:6s]">
            <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="#2B2644" strokeWidth="2" strokeDasharray="4 4" />
              <rect x="18" y="18" width="12" height="12" rx="3" fill="#2B2644" fillOpacity="0.4" />
            </svg>
          </div>
          <div className="absolute bottom-12 right-12 opacity-30 pointer-events-none hidden sm:block animate-bounce [animation-duration:8s]">
            <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
              <polygon points="32,8 56,52 8,52" stroke="#2B2644" strokeWidth="2" fill="none" />
              <circle cx="32" cy="36" r="6" fill="#2B2644" fillOpacity="0.3" />
            </svg>
          </div>

          {/* Strictly Centered Hero Content */}
          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            {/* Small Geometric Icon Mark */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[rgba(43,38,68,0.1)] text-[#2B2644] text-xs font-semibold mb-6 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2B2644]" />
              <span>DACE-I Student Innovation Showcase · Digital University Kerala</span>
            </motion.div>

            {/* H1 Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-[-0.025em] text-[#141320] leading-[1.08] mb-6"
            >
              One campus. Three problems. <br />
              <span className="bg-gradient-to-r from-[#2B2644] to-[#11101D] bg-clip-text text-transparent font-semibold">
                One unified platform.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-base sm:text-lg text-[#64677A] max-w-xl mx-auto leading-relaxed mb-10"
            >
              DUK Hub replaces paper gate registers, uncounted mess food waste, and untracked WhatsApp complaints with an instantaneous, role-based student and campus administration portal.
            </motion.p>

            {/* Pill CTA Buttons with ample breathing room from bottom */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-8"
            >
              <Link
                to="/app"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 text-sm sm:text-base font-semibold rounded-full bg-[#11101D] text-white hover:bg-[#2B2644] active:scale-95 transition-all shadow-[0_12px_32px_rgba(17,16,29,0.3)] group cursor-pointer"
              >
                <span>Launch the demo</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold rounded-full bg-white/80 hover:bg-white text-[#141320] border border-[rgba(43,38,68,0.12)] transition-all shadow-xs"
              >
                <span>Switch Persona</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5.3 ASYMMETRIC INTRO SECTION (2-Col, 50/50, py-16 md:py-24) */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-24" id="product">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div>
            <span className="text-xs font-bold text-[#64677A] tracking-wider uppercase block mb-2">
              The Campus Challenge
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#141320] tracking-[-0.02em] leading-tight mb-6">
              Rethinking daily friction points for 1,200+ residential scholars.
            </h2>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2B2644] text-white text-xs font-semibold hover:bg-[#11101D] transition-colors"
            >
              <span>Explore Interactive Modules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div>
            <p className="text-lg sm:text-xl text-[#64677A] leading-relaxed mb-6 font-normal">
              Digital University Kerala operates 24/7 with specialized research labs, academic blocks, and residential complexes. Yet key student touchpoints remained manual, creating unaccounted food waste, slow maintenance resolution, and physical logbook bottlenecks at the campus gate.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[rgba(43,38,68,0.08)]">
              <div>
                <span className="block text-2xl font-bold text-[#141320]">100%</span>
                <span className="text-xs text-[#64677A]">Client-side persistence & privacy</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-[#141320]">30s</span>
                <span className="text-xs text-[#64677A]">Cryptographic gate QR turnover</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.4 3-CARD ASYMMETRIC BENTO GRID (2fr 1fr 1fr, py-16 md:py-20) */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20" id="modules">
        <div className="mb-10">
          <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
            Three Core Modules
          </span>
          <h3 className="text-2xl sm:text-3xl font-medium text-[#141320] tracking-tight">
            Designed for instant student utility and transparent administration.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card 1: Wide Left (2fr) */}
          <Link to="/app/complaints" className="md:col-span-2 block group">
            <Card
              variant="gradient"
              tilt
              className="h-[320px] p-8 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="purple" pulse>
                    Module A
                  </Badge>
                  <ArrowRight className="w-5 h-5 text-[#2B2644] transition-transform group-hover:translate-x-1" />
                </div>
                <h3 className="text-2xl font-semibold text-[#141320]">Complaint Tracker</h3>
                <p className="text-xs text-[#64677A] mt-1.5 max-w-sm leading-relaxed">
                  Transparent lifecycle from submission to department assignment and resolution. Includes anonymous mode and satisfaction scoring.
                </p>
              </div>

              {/* Decorative 3D Vector anchored bottom-right */}
              <div className="absolute -bottom-6 -right-6 w-52 h-52 pointer-events-none opacity-85 group-hover:scale-105 transition-transform duration-300">
                <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
                  <circle cx="100" cy="100" r="80" fill="url(#grad1)" fillOpacity="0.8" />
                  <rect x="60" y="60" width="80" height="80" rx="20" fill="#2B2644" fillOpacity="0.15" />
                  <path d="M75 100L90 115L125 80" stroke="#2B2644" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="grad1" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFFFFF" />
                      <stop offset="1" stopColor="#C5CBE8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="relative z-10">
                <span className="text-xs font-semibold text-[#2B2644] underline underline-offset-4">
                  Open Tracker →
                </span>
              </div>
            </Card>
          </Link>

          {/* Card 2: Middle (1fr) */}
          <Link to="/app/mess" className="md:col-span-1 block group">
            <Card
              variant="dark"
              spotlight
              tilt
              className="h-[320px] p-8 flex flex-col justify-between"
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
                <span className="text-xs font-medium text-emerald-400 block mb-0.5">
                  ● Zero Food Waste
                </span>
                <span className="text-[11px] text-[#C9C7DA]">Next cutoff: 8:00 PM</span>
              </div>
            </Card>
          </Link>

          {/* Card 3: Right (1fr) */}
          <Link to="/app/gate" className="md:col-span-1 block group">
            <Card
              variant="dark"
              spotlight
              tilt
              className="h-[320px] p-8 flex flex-col justify-between"
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
                  ● 30s Live Token
                </span>
                <span className="text-[11px] text-[#C9C7DA]">Zero paper registers</span>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* 5.5 LOGO / SOCIAL PROOF STRIP */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-12 border-y border-[rgba(43,38,68,0.06)] my-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="shrink-0 text-center md:text-left">
            <p className="text-xs font-bold text-[#141320] uppercase tracking-wider">
              Built for Digital University Kerala
            </p>
            <p className="text-[11px] text-[#64677A]">DACE-I Community Technology Showcase 2026</p>
          </div>

          {/* Partner Wordmarks */}
          <div className="flex-1 overflow-hidden relative">
            <div className="flex items-center gap-10 opacity-60 hover:opacity-100 transition-opacity justify-center md:justify-end">
              {['DUK', 'KSUM', 'IIITMK', 'Digital Kerala', 'NASSCOM', 'KDisc'].map((partner) => (
                <span
                  key={partner}
                  className="font-bold text-sm tracking-widest text-[#2B2644] select-none hover:text-[#11101D] transition-colors"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5.6 ASYMMETRIC FEATURE SHOWCASE (40/60 Split, py-16 md:py-24) */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
          {/* Left Column (40%) */}
          <div className="md:col-span-2">
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
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant 1-click role switching for committee evaluation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero external dependencies or CDNs that could fail during demo</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pre-seeded with 18 realistic Kerala student profiles</span>
              </li>
            </ul>
          </div>

          {/* Right Column: Large White Elevated Card (60%) */}
          <div className="md:col-span-3">
            <Card variant="elevated" className="p-8 sm:p-10 relative overflow-hidden bg-white">
              <div className="flex items-start justify-between pb-6 border-b border-[rgba(43,38,68,0.06)]">
                <div>
                  <h3 className="text-xl font-semibold text-[#141320]">Unified Campus Dashboard</h3>
                  <p className="text-xs text-[#64677A] mt-1">
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

              {/* Graphic Mockup Area */}
              <div className="mt-8 p-6 rounded-[20px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.08)]">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white p-3 rounded-[12px] border border-[rgba(43,38,68,0.06)]">
                    <span className="text-[10px] text-[#64677A] uppercase font-bold block">Open Tickets</span>
                    <span className="text-lg font-bold text-[#141320]">7 Active</span>
                  </div>
                  <div className="bg-white p-3 rounded-[12px] border border-[rgba(43,38,68,0.06)]">
                    <span className="text-[10px] text-[#64677A] uppercase font-bold block">Lunch Booked</span>
                    <span className="text-lg font-bold text-[#2B2644]">142 Meals</span>
                  </div>
                  <div className="bg-white p-3 rounded-[12px] border border-[rgba(43,38,68,0.06)]">
                    <span className="text-[10px] text-[#64677A] uppercase font-bold block">On Campus</span>
                    <span className="text-lg font-bold text-emerald-600">9 Active</span>
                  </div>
                </div>

                <div className="h-16 rounded-[12px] bg-gradient-to-r from-[#E9ECF6] to-[#C5CBE8] flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-semibold text-[#2B2644]">Live Verification Gate Stream</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#2B2644]/70">GATE-01 · ACTIVE</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 5.7 STATS & IMPACT ROW (my-16, py-8 px-10) */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 my-16" id="impact">
        <div className="rounded-[28px] bg-[#2B2644] text-white py-10 px-8 sm:px-12 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="pt-4 sm:pt-0">
              <span className="block text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2">
                18+
              </span>
              <span className="text-xs text-[#C9C7DA] uppercase tracking-wider font-semibold">
                Seeded Student Profiles
              </span>
            </div>

            <div className="pt-4 sm:pt-0">
              <span className="block text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2">
                3
              </span>
              <span className="text-xs text-[#C9C7DA] uppercase tracking-wider font-semibold">
                Functional Modules
              </span>
            </div>

            <div className="pt-4 sm:pt-0">
              <span className="block text-4xl sm:text-5xl font-bold tracking-tight text-emerald-400 mb-2">
                Zero
              </span>
              <span className="text-xs text-[#C9C7DA] uppercase tracking-wider font-semibold">
                Food Waste Target
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-medium text-[#141320] tracking-[-0.02em]">
            Ready to experience the 5-minute DACE-I evaluation walkthrough?
          </h2>
          <p className="text-sm text-[#64677A] leading-relaxed">
            Follow the live demo script: file a complaint, switch to admin to resolve it, book tomorrow's lunch, and generate your 30s security gate QR.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#11101D] text-white font-semibold hover:bg-[#2B2644] shadow-md active:scale-95 transition-all"
            >
              <span>Start 5-Minute Walkthrough</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
