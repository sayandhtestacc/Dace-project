/**
 * DUK Hub — Global State (Zustand + localStorage)
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  UserRole, Student, Complaint, ComplaintStatus, ComplaintPriority,
  DayMenu, MealBooking, MealType, BookingStatus,
  WalletTxn, GateLog, Notification, Visitor, ComplaintDraft, ComplaintComment,
} from './types'
import { createSeedData, type SeedData } from './seed'
import { generateRefId, getInitials } from '../lib/format'

interface AppState extends SeedData {
  // ─── Authentication, Role & Students ───
  loginUser: (role: UserRole, studentId?: string) => void
  logoutUser: () => void
  switchRole: (role: UserRole) => void
  switchStudent: (studentId: string) => void
  addStudent: (s: Omit<Student, 'id' | 'qrToken' | 'avatarInitials'>) => string
  updateStudentProfile: (studentId: string, updates: Partial<Student>) => void

  // ─── Complaints ───
  addComplaint: (c: Omit<Complaint, 'id' | 'refId' | 'createdAt' | 'resolvedAt' | 'rating' | 'comments' | 'upvotes' | 'status'>) => string
  updateComplaintStatus: (id: string, status: ComplaintStatus, assignedTo?: string) => void
  addComplaintComment: (complaintId: string, comment: Omit<ComplaintComment, 'id' | 'createdAt'>) => void
  rateComplaint: (id: string, rating: number) => void
  upvoteComplaint: (id: string) => void

  // ─── Mess ───
  bookMeal: (studentId: string, date: string, mealType: MealType, price: number) => void
  skipMeal: (bookingId: string) => void
  markServed: (bookingId: string) => void
  topUpWallet: (studentId: string, amount: number) => void

  // ─── Gate ───
  activeGateToken: string
  activeGateName: string
  isGateAfterHoursMode: boolean
  setGateName: (name: string) => void
  setGateAfterHoursMode: (isAfter: boolean) => void
  rotateGateToken: () => void
  logEntry: (
    studentId: string,
    purpose: string,
    destination: string,
    isAfterHours?: boolean,
    gateName?: string,
    scanType?: 'student_scanned_gate' | 'guard_scanned_student'
  ) => void
  logExit: (logId: string) => void
  logExitForStudent: (studentId: string) => void
  addVisitor: (visitor: Omit<Visitor, 'id'>) => void

  // ─── Notifications ───
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void

  // ─── Draft ───
  complaintDraft: ComplaintDraft | null
  saveComplaintDraft: (draft: ComplaintDraft) => void
  clearComplaintDraft: () => void

  // ─── Reset ───
  resetDemoData: () => void
}

const id = () => Math.random().toString(36).substring(2, 11)

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...createSeedData(),
      complaintDraft: null,
      activeGateToken: 'GATE-1-8492A',
      activeGateName: 'Main Gate 1',
      isGateAfterHoursMode: false,

      setGateName: (name: string) => set({ activeGateName: name }),
      setGateAfterHoursMode: (isAfter: boolean) => set({ isGateAfterHoursMode: isAfter }),
      rotateGateToken: () =>
        set({
          activeGateToken: `GATE-${Math.floor(Math.random() * 3 + 1)}-${Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase()}`,
        }),

      // ─── Authentication, Role & Students ───
      loginUser: (role, studentId) =>
        set((state) => ({
          isAuthenticated: true,
          currentRole: role,
          currentStudentId:
            studentId || (role === 'student' ? state.currentStudentId || 'stu-01' : state.currentStudentId),
        })),
      logoutUser: () => set({ isAuthenticated: false }),
      switchRole: (role) => set({ currentRole: role }),
      switchStudent: (studentId) => set({ currentStudentId: studentId }),
      addStudent: (s) => {
        const newId = `stu-${Math.random().toString(36).substring(2, 6)}`
        const initials = getInitials(s.name)
        const newStudent: Student = {
          ...s,
          id: newId,
          qrToken: `QR-${s.name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8)}-${newId.slice(-2)}`,
          avatarInitials: initials,
        }
        set((state) => ({
          students: [newStudent, ...state.students],
          currentStudentId: newId,
        }))
        return newId
      },
      updateStudentProfile: (studentId, updates) =>
        set((state) => ({
          students: state.students.map((stu) =>
            stu.id === studentId ? { ...stu, ...updates } : stu
          ),
        })),

      // ─── Complaints ───
      addComplaint: (c) => {
        const refId = generateRefId('CMP')
        const complaint: Complaint = {
          ...c,
          id: id(),
          refId,
          status: 'Submitted',
          createdAt: Date.now(),
          resolvedAt: null,
          rating: null,
          comments: [],
          upvotes: 0,
        }
        set(s => ({
          complaints: [complaint, ...s.complaints],
          notifications: [{
            id: id(),
            title: 'Complaint Submitted',
            message: `Your complaint "${c.title}" has been submitted. Reference: ${refId}`,
            type: 'update' as const,
            read: false,
            createdAt: Date.now(),
            link: '/app/complaints',
          }, ...s.notifications],
        }))
        return refId
      },

      updateComplaintStatus: (cid, status, assignedTo) => set(s => ({
        complaints: s.complaints.map(c =>
          c.id === cid ? {
            ...c,
            status,
            assignedTo: assignedTo ?? c.assignedTo,
            resolvedAt: status === 'Resolved' ? Date.now() : c.resolvedAt,
          } : c
        ),
        notifications: [{
          id: id(),
          title: 'Complaint Update',
          message: `Complaint ${s.complaints.find(c => c.id === cid)?.refId} status changed to ${status}.`,
          type: 'update' as const,
          read: false,
          createdAt: Date.now(),
          link: '/app/complaints',
        }, ...s.notifications],
      })),

      addComplaintComment: (complaintId, comment) => set(s => ({
        complaints: s.complaints.map(c =>
          c.id === complaintId ? {
            ...c,
            comments: [...c.comments, { ...comment, id: id(), createdAt: Date.now() }],
          } : c
        ),
      })),

      rateComplaint: (cid, rating) => set(s => ({
        complaints: s.complaints.map(c =>
          c.id === cid ? {
            ...c,
            rating,
            status: rating <= 2 ? 'Reopened' : c.status,
          } : c
        ),
      })),

      upvoteComplaint: (cid) => set(s => ({
        complaints: s.complaints.map(c =>
          c.id === cid ? { ...c, upvotes: c.upvotes + 1 } : c
        ),
      })),

      // ─── Mess ───
      bookMeal: (studentId, date, mealType, price) => {
        const booking: MealBooking = {
          id: id(),
          studentId,
          date,
          mealType,
          status: 'booked',
          price,
          bookedAt: Date.now(),
        }
        const txn: WalletTxn = {
          id: id(),
          studentId,
          amount: -price,
          type: 'deduction',
          description: `${mealType} booking — ${date}`,
          createdAt: Date.now(),
          balanceAfter: 0,
        }
        set(s => {
          const student = s.students.find(st => st.id === studentId)!
          const newBalance = student.walletBalance - price
          txn.balanceAfter = newBalance
          return {
            mealBookings: [...s.mealBookings, booking],
            walletTxns: [txn, ...s.walletTxns],
            students: s.students.map(st =>
              st.id === studentId ? { ...st, walletBalance: newBalance } : st
            ),
          }
        })
      },

      skipMeal: (bookingId) => set(s => {
        const booking = s.mealBookings.find(b => b.id === bookingId)!
        const refundTxn: WalletTxn = {
          id: id(),
          studentId: booking.studentId,
          amount: booking.price,
          type: 'refund',
          description: `${booking.mealType} skip refund — ${booking.date}`,
          createdAt: Date.now(),
          balanceAfter: 0,
        }
        const student = s.students.find(st => st.id === booking.studentId)!
        const newBalance = student.walletBalance + booking.price
        refundTxn.balanceAfter = newBalance
        return {
          mealBookings: s.mealBookings.map(b =>
            b.id === bookingId ? { ...b, status: 'skipped' as BookingStatus } : b
          ),
          walletTxns: [refundTxn, ...s.walletTxns],
          students: s.students.map(st =>
            st.id === booking.studentId ? { ...st, walletBalance: newBalance } : st
          ),
        }
      }),

      markServed: (bookingId) => set(s => ({
        mealBookings: s.mealBookings.map(b =>
          b.id === bookingId ? { ...b, status: 'served' as BookingStatus } : b
        ),
      })),

      topUpWallet: (studentId, amount) => set(s => {
        const student = s.students.find(st => st.id === studentId)!
        const newBalance = student.walletBalance + amount
        return {
          students: s.students.map(st =>
            st.id === studentId ? { ...st, walletBalance: newBalance } : st
          ),
          walletTxns: [{
            id: id(),
            studentId,
            amount,
            type: 'topup' as const,
            description: `Wallet top-up`,
            createdAt: Date.now(),
            balanceAfter: newBalance,
          }, ...s.walletTxns],
          notifications: [{
            id: id(),
            title: 'Wallet Top-up',
            message: `₹${amount} added to your mess wallet. New balance: ₹${newBalance}`,
            type: 'update' as const,
            read: false,
            createdAt: Date.now(),
            link: '/app/mess/wallet',
          }, ...s.notifications],
        }
      }),

      // ─── Gate ───
      logEntry: (studentId, purpose, destination, isAfterHours = false, gateName = 'Main Gate 1', scanType = 'student_scanned_gate') => {
        const student = get().students.find(s => s.id === studentId)!
        const studentName = student ? student.name : 'Unknown Scholar'
        const department = student ? student.department : 'General'
        const newLog: GateLog = {
          id: id(),
          studentId,
          studentName,
          department,
          entryTime: Date.now(),
          exitTime: null,
          purpose,
          destination,
          isAfterHours,
          gateName,
          scanType,
        }

        const newNotifications = [...get().notifications]
        if (isAfterHours) {
          newNotifications.unshift({
            id: id(),
            title: `After-Hours Alert: ${studentName}`,
            message: `Late campus entry recorded at ${gateName} (${purpose} — ${destination}). Flagged for Warden review.`,
            type: 'alert' as const,
            read: false,
            createdAt: Date.now(),
            link: '/app/warden',
          })
        }

        set(s => ({
          gateLogs: [newLog, ...s.gateLogs],
          notifications: newNotifications,
        }))
      },

      logExit: (logId) => set(s => {
        const log = s.gateLogs.find(l => l.id === logId)
        const updatedLogs = s.gateLogs.map(l =>
          l.id === logId ? { ...l, exitTime: Date.now() } : l
        )
        const newNotifications = [...s.notifications]
        if (log && log.isAfterHours) {
          newNotifications.unshift({
            id: id(),
            title: `After-Hours Departure: ${log.studentName}`,
            message: `Scholar checked out from ${log.destination} via ${log.gateName || 'Main Gate 1'}.`,
            type: 'alert' as const,
            read: false,
            createdAt: Date.now(),
            link: '/app/warden',
          })
        }
        return {
          gateLogs: updatedLogs,
          notifications: newNotifications,
        }
      }),

      logExitForStudent: (studentId) => set(s => {
        const active = s.gateLogs.find(l => l.studentId === studentId && l.exitTime === null)
        if (!active) return s
        const updatedLogs = s.gateLogs.map(l =>
          l.id === active.id ? { ...l, exitTime: Date.now() } : l
        )
        const newNotifications = [...s.notifications]
        if (active.isAfterHours) {
          newNotifications.unshift({
            id: id(),
            title: `After-Hours Departure: ${active.studentName}`,
            message: `Scholar checked out from ${active.destination} via ${active.gateName || 'Main Gate 1'}.`,
            type: 'alert' as const,
            read: false,
            createdAt: Date.now(),
            link: '/app/warden',
          })
        }
        return {
          gateLogs: updatedLogs,
          notifications: newNotifications,
        }
      }),

      addVisitor: (visitor) => set(s => ({
        visitors: [{ ...visitor, id: id() }, ...s.visitors],
      })),

      // ─── Notifications ───
      addNotification: (n) => set(s => ({
        notifications: [{ ...n, id: id(), createdAt: Date.now(), read: false }, ...s.notifications],
      })),
      markNotificationRead: (nid) => set(s => ({
        notifications: s.notifications.map(n => n.id === nid ? { ...n, read: true } : n),
      })),
      markAllNotificationsRead: () => set(s => ({
        notifications: s.notifications.map(n => ({ ...n, read: true })),
      })),

      // ─── Draft ───
      saveComplaintDraft: (draft) => set({ complaintDraft: draft }),
      clearComplaintDraft: () => set({ complaintDraft: null }),

      // ─── Reset ───
      resetDemoData: () => {
        const fresh = createSeedData()
        set({ ...fresh, complaintDraft: null })
      },
    }),
    {
      name: 'duk-hub-store',
      version: 1,
    }
  )
)
