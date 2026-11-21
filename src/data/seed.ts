/**
 * DUK Hub — Seed Data Generator
 * All fake data, relative to Date.now() for fresh timestamps.
 */
import type {
  Student, Complaint, ComplaintComment, DayMenu, MenuItem,
  MealBooking, WalletTxn, GateLog, Notification, Visitor,
} from './types'
import { generateRefId, getInitials } from '../lib/format'

const SEED_VERSION = 'duk-hub-v1'
const now = Date.now()
const hour = 3600000
const day = 86400000

function id(): string {
  return Math.random().toString(36).substring(2, 11)
}

// ─── Students ───
export const students: Student[] = [
  { id: 'stu-01', name: 'Arjun Menon', department: 'Data Science', year: 2, email: 'arjun.menon@demo.duk.ac.in', qrToken: 'QR-ARJUN-01', avatarInitials: 'AM', walletBalance: 1850 },
  { id: 'stu-02', name: 'Meera Krishnan', department: 'CSE', year: 3, email: 'meera.k@demo.duk.ac.in', qrToken: 'QR-MEERA-02', avatarInitials: 'MK', walletBalance: 2400 },
  { id: 'stu-03', name: 'Rahul Nair', department: 'ECE', year: 1, email: 'rahul.nair@demo.duk.ac.in', qrToken: 'QR-RAHUL-03', avatarInitials: 'RN', walletBalance: 980 },
  { id: 'stu-04', name: 'Anjali Suresh', department: 'Digital Humanities', year: 2, email: 'anjali.s@demo.duk.ac.in', qrToken: 'QR-ANJALI-04', avatarInitials: 'AS', walletBalance: 1200 },
  { id: 'stu-05', name: 'Vishnu Prasad', department: 'MBA', year: 1, email: 'vishnu.p@demo.duk.ac.in', qrToken: 'QR-VISHNU-05', avatarInitials: 'VP', walletBalance: 3100 },
  { id: 'stu-06', name: 'Devi Lakshmi', department: 'CSE', year: 2, email: 'devi.l@demo.duk.ac.in', qrToken: 'QR-DEVI-06', avatarInitials: 'DL', walletBalance: 750 },
  { id: 'stu-07', name: 'Arun Kumar', department: 'Data Science', year: 3, email: 'arun.k@demo.duk.ac.in', qrToken: 'QR-ARUN-07', avatarInitials: 'AK', walletBalance: 2050 },
  { id: 'stu-08', name: 'Priya Mohan', department: 'ECE', year: 2, email: 'priya.m@demo.duk.ac.in', qrToken: 'QR-PRIYA-08', avatarInitials: 'PM', walletBalance: 1600 },
  { id: 'stu-09', name: 'Sreehari Raj', department: 'CSE', year: 1, email: 'sreehari.r@demo.duk.ac.in', qrToken: 'QR-SREEHARI-09', avatarInitials: 'SR', walletBalance: 90 },
  { id: 'stu-10', name: 'Kavya Nambiar', department: 'Digital Humanities', year: 3, email: 'kavya.n@demo.duk.ac.in', qrToken: 'QR-KAVYA-10', avatarInitials: 'KN', walletBalance: 1450 },
  { id: 'stu-11', name: 'Ajith Thomas', department: 'MBA', year: 2, email: 'ajith.t@demo.duk.ac.in', qrToken: 'QR-AJITH-11', avatarInitials: 'AT', walletBalance: 2700 },
  { id: 'stu-12', name: 'Roshni George', department: 'Data Science', year: 1, email: 'roshni.g@demo.duk.ac.in', qrToken: 'QR-ROSHNI-12', avatarInitials: 'RG', walletBalance: 1900 },
  { id: 'stu-13', name: 'Nikhil Varma', department: 'ECE', year: 3, email: 'nikhil.v@demo.duk.ac.in', qrToken: 'QR-NIKHIL-13', avatarInitials: 'NV', walletBalance: 500 },
  { id: 'stu-14', name: 'Sreelakshmi Pillai', department: 'CSE', year: 2, email: 'sreelakshmi.p@demo.duk.ac.in', qrToken: 'QR-SREE-14', avatarInitials: 'SP', walletBalance: 2200 },
  { id: 'stu-15', name: 'Deepak Rajan', department: 'MBA', year: 1, email: 'deepak.r@demo.duk.ac.in', qrToken: 'QR-DEEPAK-15', avatarInitials: 'DR', walletBalance: 1100 },
  { id: 'stu-16', name: 'Amrita Das', department: 'Data Science', year: 2, email: 'amrita.d@demo.duk.ac.in', qrToken: 'QR-AMRITA-16', avatarInitials: 'AD', walletBalance: 1750 },
  { id: 'stu-17', name: 'Govind Krishnan', department: 'Digital Humanities', year: 1, email: 'govind.k@demo.duk.ac.in', qrToken: 'QR-GOVIND-17', avatarInitials: 'GK', walletBalance: 3400 },
  { id: 'stu-18', name: 'Nandana Pillai', department: 'ECE', year: 2, email: 'nandana.p@demo.duk.ac.in', qrToken: 'QR-NANDANA-18', avatarInitials: 'NP', walletBalance: 600 },
]

// ─── Complaints ───
export function generateComplaints(): Complaint[] {
  return [
    {
      id: id(), refId: 'CMP-A7F3E1', studentId: 'stu-01', category: 'Technical',
      title: 'Wi-Fi not working in Block B — 2nd floor',
      description: 'The Wi-Fi access point near Room 204 in Block B has been down since yesterday morning. Students on the entire 2nd floor cannot connect. This is affecting our project deadlines.',
      photoUrl: null, priority: 'Urgent', status: 'In Progress', assignedTo: 'IT Department',
      isAnonymous: false, upvotes: 12, createdAt: now - 2 * hour, resolvedAt: null, rating: null,
      comments: [
        { id: id(), author: 'Arjun Menon', authorRole: 'student', content: 'This has been happening intermittently for the past week, but now it is completely dead.', createdAt: now - 2 * hour + 300000 },
        { id: id(), author: 'IT Support', authorRole: 'admin', content: 'We have identified the faulty access point. A replacement unit has been ordered and should be installed by tomorrow.', createdAt: now - 1 * hour },
      ],
    },
    {
      id: id(), refId: 'CMP-B2D9C4', studentId: 'stu-03', category: 'Hostel',
      title: 'Hostel geyser not heating — Block A, Room 112',
      description: 'The geyser in the common bathroom on the 1st floor of Block A has not been heating water for three days. Cold water showers in the morning are very uncomfortable.',
      photoUrl: null, priority: 'Normal', status: 'Assigned', assignedTo: 'Maintenance',
      isAnonymous: false, upvotes: 8, createdAt: now - 18 * hour, resolvedAt: null, rating: null,
      comments: [
        { id: id(), author: 'Maintenance Dept', authorRole: 'admin', content: 'Acknowledged. A plumber will inspect the geyser tomorrow between 10 AM and 12 PM.', createdAt: now - 12 * hour },
      ],
    },
    {
      id: id(), refId: 'CMP-C5E8A2', studentId: 'stu-06', category: 'Mess',
      title: 'Mess water filter needs replacement',
      description: 'The RO water filter near the dining hall entrance is producing water with an unusual taste. The filter indicator shows it is overdue for replacement.',
      photoUrl: null, priority: 'Urgent', status: 'Submitted', assignedTo: null,
      isAnonymous: false, upvotes: 15, createdAt: now - 4 * hour, resolvedAt: null, rating: null,
      comments: [],
    },
    {
      id: id(), refId: 'CMP-D1F4B7', studentId: 'stu-02', category: 'Academic',
      title: 'Projector malfunction in Lecture Hall 3',
      description: 'The ceiling-mounted projector in LH-3 flickers constantly and shows a yellow tint. Faculty have been using personal laptops as a workaround, but it disrupts lectures.',
      photoUrl: null, priority: 'Normal', status: 'Resolved', assignedTo: 'AV Department',
      isAnonymous: false, upvotes: 6, createdAt: now - 5 * day, resolvedAt: now - 2 * day, rating: 4,
      comments: [
        { id: id(), author: 'AV Department', authorRole: 'admin', content: 'The projector lamp has been replaced. Please confirm if the issue is resolved.', createdAt: now - 3 * day },
        { id: id(), author: 'Meera Krishnan', authorRole: 'student', content: 'Confirmed — projector is working fine now. Thank you!', createdAt: now - 2 * day },
      ],
    },
    {
      id: id(), refId: 'CMP-E3A6D9', studentId: 'stu-08', category: 'Technical',
      title: 'Lab PC-14 blue screens during MATLAB sessions',
      description: 'PC number 14 in the ECE Computing Lab crashes with a blue screen whenever MATLAB is opened. This started after the last Windows update. Other students have reported the same issue on PCs 12 and 15.',
      photoUrl: null, priority: 'Normal', status: 'In Progress', assignedTo: 'IT Department',
      isAnonymous: false, upvotes: 4, createdAt: now - 36 * hour, resolvedAt: null, rating: null,
      comments: [],
    },
    {
      id: id(), refId: 'CMP-F7B2E5', studentId: 'stu-10', category: 'Other',
      title: 'Broken bench near the main library entrance',
      description: 'The concrete bench near the library main entrance has a large crack and one leg is unstable. It could be a safety hazard, especially in the evening when visibility is low.',
      photoUrl: null, priority: 'Low', status: 'Submitted', assignedTo: null,
      isAnonymous: true, upvotes: 3, createdAt: now - 48 * hour, resolvedAt: null, rating: null,
      comments: [],
    },
    {
      id: id(), refId: 'CMP-G9C1F8', studentId: 'stu-05', category: 'Hostel',
      title: 'Ceiling fan making loud noise — Block C, Room 305',
      description: 'The ceiling fan in Room 305, Block C has been making a grinding noise for the past week. It vibrates excessively at higher speeds and we are concerned about safety.',
      photoUrl: null, priority: 'Normal', status: 'Resolved', assignedTo: 'Maintenance',
      isAnonymous: false, upvotes: 2, createdAt: now - 7 * day, resolvedAt: now - 4 * day, rating: 5,
      comments: [
        { id: id(), author: 'Maintenance Dept', authorRole: 'admin', content: 'Fan bearings have been replaced and the fan is now running smoothly.', createdAt: now - 5 * day },
        { id: id(), author: 'Vishnu Prasad', authorRole: 'student', content: 'Works perfectly now. Great job!', createdAt: now - 4 * day },
      ],
    },
    {
      id: id(), refId: 'CMP-H4D7A3', studentId: 'stu-12', category: 'Academic',
      title: 'Attendance discrepancy for DS201 — October batch',
      description: 'My attendance for DS201 (Data Structures) shows 72% but I have attended all classes except two approved medical leaves. The portal seems to have missed 4 sessions.',
      photoUrl: null, priority: 'Urgent', status: 'Assigned', assignedTo: 'Academic Office',
      isAnonymous: false, upvotes: 1, createdAt: now - 8 * hour, resolvedAt: null, rating: null,
      comments: [],
    },
    {
      id: id(), refId: 'CMP-I6E9B1', studentId: 'stu-14', category: 'Mess',
      title: 'Insufficient vegetarian options during dinner',
      description: 'For the past two weeks, the dinner menu has had only one vegetarian main dish. Many vegetarian students are left with very limited choices. We request at least two veg mains per dinner.',
      photoUrl: null, priority: 'Normal', status: 'Submitted', assignedTo: null,
      isAnonymous: false, upvotes: 19, createdAt: now - 6 * hour, resolvedAt: null, rating: null,
      comments: [],
    },
  ]
}

// ─── Mess Menu ───
export function generateWeeklyMenu(): DayMenu[] {
  const menuData: { meals: Omit<MenuItem, 'price'>[] }[] = [
    { meals: [
      { mealType: 'Breakfast', items: ['Idli', 'Sambar', 'Coconut Chutney', 'Banana'], isVeg: true },
      { mealType: 'Lunch', items: ['Rice', 'Fish Curry', 'Thoran', 'Rasam', 'Papad'], isVeg: false },
      { mealType: 'Dinner', items: ['Chapati', 'Paneer Butter Masala', 'Dal Fry', 'Salad'], isVeg: true },
    ]},
    { meals: [
      { mealType: 'Breakfast', items: ['Dosa', 'Tomato Chutney', 'Potato Masala', 'Tea'], isVeg: true },
      { mealType: 'Lunch', items: ['Rice', 'Chicken Curry', 'Avial', 'Buttermilk', 'Pickle'], isVeg: false },
      { mealType: 'Dinner', items: ['Parotta', 'Egg Roast', 'Vegetable Stew', 'Payasam'], isVeg: false },
    ]},
    { meals: [
      { mealType: 'Breakfast', items: ['Puttu', 'Kadala Curry', 'Pappadam', 'Boiled Egg'], isVeg: false },
      { mealType: 'Lunch', items: ['Rice', 'Sambar', 'Cabbage Thoran', 'Curd', 'Mango Pickle'], isVeg: true },
      { mealType: 'Dinner', items: ['Fried Rice', 'Gobi Manchurian', 'Tomato Soup', 'Ice Cream'], isVeg: true },
    ]},
    { meals: [
      { mealType: 'Breakfast', items: ['Appam', 'Veg Stew', 'Banana', 'Coffee'], isVeg: true },
      { mealType: 'Lunch', items: ['Rice', 'Prawn Masala', 'Beans Mezhukkupuratti', 'Rasam'], isVeg: false },
      { mealType: 'Dinner', items: ['Chapati', 'Chole Masala', 'Jeera Rice', 'Raita'], isVeg: true },
    ]},
    { meals: [
      { mealType: 'Breakfast', items: ['Upma', 'Coconut Chutney', 'Vada', 'Tea'], isVeg: true },
      { mealType: 'Lunch', items: ['Biriyani (Chicken)', 'Raita', 'Salad', 'Pappad'], isVeg: false },
      { mealType: 'Dinner', items: ['Roti', 'Mushroom Masala', 'Mixed Veg', 'Sweet'], isVeg: true },
    ]},
    { meals: [
      { mealType: 'Breakfast', items: ['Poori', 'Potato Curry', 'Pickle', 'Milk'], isVeg: true },
      { mealType: 'Lunch', items: ['Rice', 'Fish Fry', 'Sambar', 'Olan', 'Papad'], isVeg: false },
      { mealType: 'Dinner', items: ['Noodles', 'Manchurian', 'Fried Rice', 'Soup'], isVeg: true },
    ]},
    { meals: [
      { mealType: 'Breakfast', items: ['Idiyappam', 'Egg Curry', 'Coconut Milk', 'Fruits'], isVeg: false },
      { mealType: 'Lunch', items: ['Rice', 'Veg Kurma', 'Parippu', 'Buttermilk', 'Achaar'], isVeg: true },
      { mealType: 'Dinner', items: ['Chapati', 'Butter Chicken', 'Dal Tadka', 'Gulab Jamun'], isVeg: false },
    ]},
  ]

  const prices: Record<string, number> = { Breakfast: 30, Lunch: 60, Dinner: 50 }
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return menuData.map((dayData, i) => {
    const date = new Date(today.getTime() + i * day)
    return {
      date: date.toISOString().split('T')[0],
      dayName: dayNames[date.getDay()],
      meals: dayData.meals.map(m => ({
        ...m,
        price: prices[m.mealType],
      })),
    }
  })
}

// ─── Meal Bookings ───
export function generateMealBookings(): MealBooking[] {
  return [
    { id: id(), studentId: 'stu-01', date: new Date(now).toISOString().split('T')[0], mealType: 'Breakfast', status: 'served', price: 30, bookedAt: now - 14 * hour },
    { id: id(), studentId: 'stu-01', date: new Date(now).toISOString().split('T')[0], mealType: 'Lunch', status: 'booked', price: 60, bookedAt: now - 10 * hour },
    { id: id(), studentId: 'stu-02', date: new Date(now).toISOString().split('T')[0], mealType: 'Breakfast', status: 'served', price: 30, bookedAt: now - 15 * hour },
    { id: id(), studentId: 'stu-02', date: new Date(now).toISOString().split('T')[0], mealType: 'Lunch', status: 'booked', price: 60, bookedAt: now - 9 * hour },
    { id: id(), studentId: 'stu-02', date: new Date(now).toISOString().split('T')[0], mealType: 'Dinner', status: 'booked', price: 50, bookedAt: now - 8 * hour },
    { id: id(), studentId: 'stu-03', date: new Date(now).toISOString().split('T')[0], mealType: 'Lunch', status: 'booked', price: 60, bookedAt: now - 11 * hour },
    { id: id(), studentId: 'stu-05', date: new Date(now).toISOString().split('T')[0], mealType: 'Breakfast', status: 'skipped', price: 30, bookedAt: now - 16 * hour },
    { id: id(), studentId: 'stu-05', date: new Date(now).toISOString().split('T')[0], mealType: 'Dinner', status: 'booked', price: 50, bookedAt: now - 7 * hour },
  ]
}

// ─── Wallet Transactions ───
export function generateWalletTxns(): WalletTxn[] {
  return [
    { id: id(), studentId: 'stu-01', amount: 2000, type: 'topup', description: 'Initial top-up', createdAt: now - 10 * day, balanceAfter: 2000 },
    { id: id(), studentId: 'stu-01', amount: -60, type: 'deduction', description: 'Lunch booking', createdAt: now - 10 * hour, balanceAfter: 1940 },
    { id: id(), studentId: 'stu-01', amount: -30, type: 'deduction', description: 'Breakfast booking', createdAt: now - 14 * hour, balanceAfter: 1910 },
    { id: id(), studentId: 'stu-01', amount: -60, type: 'deduction', description: 'Lunch booking', createdAt: now - 2 * day, balanceAfter: 1850 },
    { id: id(), studentId: 'stu-03', amount: 1500, type: 'topup', description: 'Initial top-up', createdAt: now - 15 * day, balanceAfter: 1500 },
    { id: id(), studentId: 'stu-03', amount: -60, type: 'deduction', description: 'Lunch booking', createdAt: now - 11 * hour, balanceAfter: 1040 },
    { id: id(), studentId: 'stu-03', amount: 50, type: 'refund', description: 'Dinner skip refund', createdAt: now - 1 * day, balanceAfter: 1100 },
    { id: id(), studentId: 'stu-09', amount: 500, type: 'topup', description: 'Initial top-up', createdAt: now - 20 * day, balanceAfter: 500 },
    { id: id(), studentId: 'stu-09', amount: -60, type: 'deduction', description: 'Lunch booking', createdAt: now - 3 * day, balanceAfter: 150 },
    { id: id(), studentId: 'stu-09', amount: -60, type: 'deduction', description: 'Lunch booking', createdAt: now - 1 * day, balanceAfter: 90 },
  ]
}

// ─── Gate Logs ───
export function generateGateLogs(): GateLog[] {
  const purposes = ['Class', 'Library', 'Lab', 'Project work', 'Hostel', 'Event', 'Other']
  const destinations = ['Main Academic Block', 'Library', 'ECE Lab', 'Innovation Hub', 'Hostel Block A', 'Auditorium', 'Canteen', 'Sports Ground', 'CSE Lab']

  const currently_inside: GateLog[] = [
    { id: id(), studentId: 'stu-01', studentName: 'Arjun Menon', department: 'Data Science', entryTime: now - 2 * hour, exitTime: null, purpose: 'Lab', destination: 'Innovation Hub' },
    { id: id(), studentId: 'stu-02', studentName: 'Meera Krishnan', department: 'CSE', entryTime: now - 4 * hour, exitTime: null, purpose: 'Class', destination: 'Main Academic Block' },
    { id: id(), studentId: 'stu-04', studentName: 'Anjali Suresh', department: 'Digital Humanities', entryTime: now - 1 * hour, exitTime: null, purpose: 'Library', destination: 'Library' },
    { id: id(), studentId: 'stu-07', studentName: 'Arun Kumar', department: 'Data Science', entryTime: now - 3 * hour, exitTime: null, purpose: 'Project work', destination: 'CSE Lab' },
    { id: id(), studentId: 'stu-08', studentName: 'Priya Mohan', department: 'ECE', entryTime: now - 30 * 60000, exitTime: null, purpose: 'Class', destination: 'ECE Lab' },
    { id: id(), studentId: 'stu-11', studentName: 'Ajith Thomas', department: 'MBA', entryTime: now - 5 * hour, exitTime: null, purpose: 'Event', destination: 'Auditorium' },
    { id: id(), studentId: 'stu-13', studentName: 'Nikhil Varma', department: 'ECE', entryTime: now - 6 * hour, exitTime: null, purpose: 'Lab', destination: 'ECE Lab' },
    { id: id(), studentId: 'stu-16', studentName: 'Amrita Das', department: 'Data Science', entryTime: now - 45 * 60000, exitTime: null, purpose: 'Library', destination: 'Library' },
    { id: id(), studentId: 'stu-17', studentName: 'Govind Krishnan', department: 'Digital Humanities', entryTime: now - 90 * 60000, exitTime: null, purpose: 'Class', destination: 'Main Academic Block' },
  ]

  const closed: GateLog[] = Array.from({ length: 17 }, (_, i) => {
    const stuIdx = (i % 18)
    const stu = students[stuIdx]
    const entryOffset = (i + 1) * 2 * hour + Math.random() * hour
    const duration = 30 * 60000 + Math.random() * 4 * hour
    return {
      id: id(),
      studentId: stu.id,
      studentName: stu.name,
      department: stu.department,
      entryTime: now - entryOffset - duration,
      exitTime: now - entryOffset,
      purpose: purposes[i % purposes.length],
      destination: destinations[i % destinations.length],
    }
  })

  return [...currently_inside, ...closed]
}

// ─── Notifications ───
export function generateNotifications(): Notification[] {
  return [
    { id: id(), title: 'Complaint Update', message: 'Your complaint "Wi-Fi not working in Block B" has been assigned to IT Department.', type: 'update', read: false, createdAt: now - 1 * hour, link: '/app/complaints' },
    { id: id(), title: 'Meal Reminder', message: 'Tomorrow\'s lunch booking closes at 8:00 PM today. Book now to avoid missing out.', type: 'reminder', read: false, createdAt: now - 2 * hour, link: '/app/mess' },
    { id: id(), title: 'Low Wallet Balance', message: 'Your mess wallet balance is below ₹100. Top up to continue booking meals.', type: 'alert', read: false, createdAt: now - 3 * hour, link: '/app/mess/wallet' },
    { id: id(), title: 'Gate Entry Logged', message: 'Your campus entry at 2:30 PM has been recorded. Purpose: Lab.', type: 'update', read: true, createdAt: now - 4 * hour, link: '/app/gate/history' },
    { id: id(), title: 'Complaint Resolved', message: 'Your complaint "Projector malfunction in LH-3" has been resolved. Rate your experience.', type: 'update', read: true, createdAt: now - 2 * day, link: '/app/complaints' },
    { id: id(), title: 'Scheduled Maintenance', message: 'Campus Wi-Fi will undergo maintenance on Saturday 10 PM to Sunday 6 AM.', type: 'alert', read: false, createdAt: now - 5 * hour },
  ]
}

// ─── Visitors ───
export function generateVisitors(): Visitor[] {
  return [
    { id: id(), name: 'Suresh Kumar', phone: '9876543210', hostStudentId: 'stu-01', hostStudentName: 'Arjun Menon', validUntil: now + 4 * hour, purpose: 'Parent visit' },
    { id: id(), name: 'Dr. Ramachandran', phone: '9845612378', hostStudentId: 'stu-02', hostStudentName: 'Meera Krishnan', validUntil: now + 2 * hour, purpose: 'Guest lecture' },
  ]
}

// ─── Seed initializer ───
export interface SeedData {
  seedVersion: string
  seededAt: number
  students: Student[]
  complaints: Complaint[]
  weeklyMenu: DayMenu[]
  mealBookings: MealBooking[]
  walletTxns: WalletTxn[]
  gateLogs: GateLog[]
  notifications: Notification[]
  visitors: Visitor[]
  currentRole: string
  currentStudentId: string
}

export function createSeedData(): SeedData {
  return {
    seedVersion: SEED_VERSION,
    seededAt: Date.now(),
    students,
    complaints: generateComplaints(),
    weeklyMenu: generateWeeklyMenu(),
    mealBookings: generateMealBookings(),
    walletTxns: generateWalletTxns(),
    gateLogs: generateGateLogs(),
    notifications: generateNotifications(),
    visitors: generateVisitors(),
    currentRole: 'student',
    currentStudentId: 'stu-01',
  }
}
