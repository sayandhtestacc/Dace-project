/**
 * DUK Hub — Type Definitions
 */

// ─── Roles ───
export type UserRole = 'student' | 'mess-manager' | 'admin' | 'security' | 'warden'

export interface AppUser {
  id: string
  name: string
  role: UserRole
  studentId?: string
}

// ─── Students ───
export interface Student {
  id: string
  name: string
  department: string
  school?: 'SoCSE' | 'SoESA' | 'SoDS' | 'SoI' | 'SoDiHLA' | string
  course?: string
  specialization?: string
  degreeLevel?: 'M.Tech' | 'M.Sc' | 'MBA' | 'MA' | 'PhD'
  isEwyl?: boolean
  rollNo?: string
  campus?: string
  hostelBlock?: string
  year: number
  email: string
  qrToken: string
  avatarInitials: string
  walletBalance: number
}

// ─── Complaints ───
export type ComplaintCategory = 'Technical' | 'Hostel' | 'Academic' | 'Mess' | 'Other'
export type ComplaintStatus = 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Reopened'
export type ComplaintPriority = 'Low' | 'Normal' | 'Urgent'

export interface ComplaintComment {
  id: string
  author: string
  authorRole: UserRole
  content: string
  createdAt: number
}

export interface Complaint {
  id: string
  refId: string
  studentId: string
  category: ComplaintCategory
  title: string
  description: string
  photoUrl: string | null
  priority: ComplaintPriority
  status: ComplaintStatus
  assignedTo: string | null
  isAnonymous: boolean
  upvotes: number
  createdAt: number
  resolvedAt: number | null
  rating: number | null
  comments: ComplaintComment[]
}

// ─── Mess ───
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner'
export type BookingStatus = 'booked' | 'skipped' | 'served'

export interface MenuItem {
  mealType: MealType
  items: string[]
  price: number
  isVeg: boolean
}

export interface DayMenu {
  date: string // ISO date string YYYY-MM-DD
  dayName: string
  meals: MenuItem[]
}

export interface MealBooking {
  id: string
  studentId: string
  date: string
  mealType: MealType
  status: BookingStatus
  price: number
  bookedAt: number
}

export interface WalletTxn {
  id: string
  studentId: string
  amount: number
  type: 'topup' | 'deduction' | 'refund'
  description: string
  createdAt: number
  balanceAfter: number
}

// ─── Gate ───
export interface GateLog {
  id: string
  studentId: string
  studentName: string
  department: string
  entryTime: number
  exitTime: number | null
  purpose: string
  destination: string
  isAfterHours?: boolean
  gateName?: string
  scanType?: 'student_scanned_gate' | 'guard_scanned_student'
}

export interface Visitor {
  id: string
  name: string
  phone: string
  hostStudentId: string
  hostStudentName: string
  validUntil: number
  purpose: string
}

// ─── Notifications ───
export type NotificationType = 'update' | 'alert' | 'reminder'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  createdAt: number
  link?: string
}

// ─── Draft ───
export interface ComplaintDraft {
  step: number
  category?: ComplaintCategory
  title?: string
  description?: string
  priority?: ComplaintPriority
  isAnonymous?: boolean
  conditionalFields?: Record<string, string>
}
