import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'

import { ToastProvider } from '@/components/ui/Toast'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { BackToTop } from '@/components/layout/BackToTop'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { AppLayout } from '@/components/layout/AppLayout'
import { Skeleton } from '@/components/ui/Skeleton'

// Lazy-loaded Pages
const Landing = lazy(() => import('@/app/Landing'))
const Login = lazy(() => import('@/app/Login'))
const Privacy = lazy(() => import('@/app/Privacy'))
const NotFound = lazy(() => import('@/app/NotFound'))

// Student Pages
const StudentDashboard = lazy(() => import('@/app/student/Dashboard'))
const ComplaintsList = lazy(() => import('@/app/student/ComplaintsList'))
const ComplaintNew = lazy(() => import('@/app/student/ComplaintNew'))
const ComplaintDetail = lazy(() => import('@/app/student/ComplaintDetail'))
const MessMenu = lazy(() => import('@/app/student/MessMenu'))
const MessWallet = lazy(() => import('@/app/student/MessWallet'))
const MessHistory = lazy(() => import('@/app/student/MessHistory'))
const GateQR = lazy(() => import('@/app/student/GateQR'))
const GateHistory = lazy(() => import('@/app/student/GateHistory'))
const Profile = lazy(() => import('@/app/student/Profile'))

// Admin / Staff Pages
const AdminDashboard = lazy(() => import('@/app/admin/AdminDashboard'))
const AdminComplaints = lazy(() => import('@/app/admin/AdminComplaints'))
const WardenComplaints = lazy(() => import('@/app/admin/WardenComplaints'))
const AdminMess = lazy(() => import('@/app/admin/AdminMess'))
const AdminGate = lazy(() => import('@/app/admin/AdminGate'))

// Route change scroll restoration
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Suspense Fallback Loader
function PageLoader() {
  return (
    <div className="max-w-[1200px] mx-auto p-8 space-y-6">
      <Skeleton variant="card" className="h-36 rounded-[24px]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton variant="card" className="h-56 rounded-[24px]" />
        <Skeleton variant="card" className="h-56 rounded-[24px]" />
        <Skeleton variant="card" className="h-56 rounded-[24px]" />
      </div>
    </div>
  )
}

export default function App() {
  // Lenis Smooth Inertia Scrolling
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollToTop />
        <ScrollProgress />
        <Navbar />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* App Portal Shell */}
            <Route path="/app" element={<AppLayout />}>
              {/* Student Routes */}
              <Route index element={<StudentDashboard />} />
              <Route path="complaints" element={<ComplaintsList />} />
              <Route path="complaints/new" element={<ComplaintNew />} />
              <Route path="complaints/:id" element={<ComplaintDetail />} />
              <Route path="mess" element={<MessMenu />} />
              <Route path="mess/wallet" element={<MessWallet />} />
              <Route path="wallet" element={<MessWallet />} />
              <Route path="mess/history" element={<MessHistory />} />
              <Route path="gate" element={<GateQR />} />
              <Route path="qr" element={<GateQR />} />
              <Route path="gate/history" element={<GateHistory />} />
              <Route path="profile" element={<Profile />} />

              {/* Dedicated Persona Dashboard Routes */}
              <Route path="mess-manager" element={<AdminMess />} />
              <Route path="admin" element={<AdminComplaints />} />
              <Route path="security" element={<AdminGate />} />
              <Route path="warden" element={<AdminDashboard />} />
              <Route path="warden/complaints" element={<WardenComplaints />} />
            </Route>

            {/* Admin App Portal (Direct Routes) */}
            <Route path="/admin" element={<AppLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="complaints" element={<AdminComplaints />} />
              <Route path="escalations" element={<WardenComplaints />} />
              <Route path="mess" element={<AdminMess />} />
              <Route path="gate" element={<AdminGate />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        <Footer />
        <CommandPalette />
        <BackToTop />
      </ToastProvider>
    </BrowserRouter>
  )
}
